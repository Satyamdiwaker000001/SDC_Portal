from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
from datetime import datetime, date

from ....api import deps
from ....models.models import Task, User, Project, ProjectPhase, TeamMember, Team, Notification, AuditLog

router = APIRouter()


# --------------------------------------------------------------------------- #
#  Schemas                                                                     #
# --------------------------------------------------------------------------- #

class TaskCreate(BaseModel):
    project_id: str
    phase_id: str        # BR-009: required
    assigned_to: str     # BR-009: required
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None


class TaskOut(BaseModel):
    id: str
    project_id: str
    phase_id: str
    assigned_to: str
    created_by: str
    title: str
    description: Optional[str]
    status: str
    due_date: Optional[date]
    submission_url: Optional[str]
    submission_demo_url: Optional[str]
    submitted_at: Optional[datetime]
    verified_at: Optional[datetime]
    verified_by: Optional[str]
    rejection_remarks: Optional[str]
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskStatusUpdate(BaseModel):
    status: str   # PENDING | IN_PROGRESS


class TaskSubmit(BaseModel):
    submission_url: str
    submission_demo_url: Optional[str] = None


class TaskVerify(BaseModel):
    decision: str               # 'VERIFY' or 'REJECT'
    remarks: Optional[str] = None


# --------------------------------------------------------------------------- #
#  Helper — recalculate metrics (BR-013, BR-014)                              #
# --------------------------------------------------------------------------- #

def recalculate_metrics(project_id: str, db: Session):
    """
    Recalculates:
    1. SDLC phase progress & sequential unlock logic (SRS 3.7.2)
    2. Overall project progress (FR-084)
    3. Developer performance scores (FR-087)
    4. Team performance scores (FR-088)

    Progress is based ONLY on Mentor-verified (COMPLETED) tasks (BR-013).
    """
    # 1. Phase progress & completion
    phases = db.exec(select(ProjectPhase).where(ProjectPhase.project_id == project_id)).all()
    all_phases_completed = True

    for phase in phases:
        tasks_in_phase = db.exec(select(Task).where(Task.phase_id == phase.id)).all()
        if not tasks_in_phase:
            phase.progress = 100 if phase.is_completed else 0
        else:
            completed_tasks = [t for t in tasks_in_phase if t.status == "COMPLETED"]
            phase.progress = int((len(completed_tasks) / len(tasks_in_phase)) * 100)
            if len(completed_tasks) == len(tasks_in_phase):
                if not phase.is_completed:
                    phase.is_completed = True
                    phase.completed_at = datetime.utcnow()
            else:
                phase.is_completed = False
                all_phases_completed = False

        phase.updated_at = datetime.utcnow()
        db.add(phase)

    db.commit()

    # 2. Sequential phase unlock (SRS 3.7.2)
    phases = sorted(phases, key=lambda p: p.sequence)
    for i in range(len(phases) - 1):
        curr = phases[i]
        nxt = phases[i + 1]
        if curr.is_completed and not nxt.is_unlocked:
            nxt.is_unlocked = True
            nxt.unlocked_at = datetime.utcnow()
            nxt.updated_at = datetime.utcnow()
            db.add(nxt)
            db.add(AuditLog(
                id=str(uuid.uuid4()),
                event_type="PHASE_UNLOCKED",
                description=f"Phase '{nxt.name}' auto-unlocked after '{curr.name}' completed.",
                performed_by="SYSTEM",
                user_role="system",
                related_module="phase",
                related_entity_id=nxt.id,
            ))

    db.commit()

    # 3. Overall project progress (FR-084)
    all_project_tasks = db.exec(select(Task).where(Task.project_id == project_id)).all()
    project = db.get(Project, project_id)
    if project:
        if all_project_tasks:
            completed = [t for t in all_project_tasks if t.status == "COMPLETED"]
            project.progress = int((len(completed) / len(all_project_tasks)) * 100)
            if len(completed) == len(all_project_tasks) and all_phases_completed:
                project.status = "COMPLETED"
        else:
            project.progress = 0
        project.updated_at = datetime.utcnow()
        db.add(project)
        db.commit()

    # 4. Developer performance scores (FR-087)
    # 10 pts per verified task + 5 pts bonus if completed on/before due date (BR-014)
    all_devs = db.exec(select(User).where(User.role == "developer")).all()
    for u in all_devs:
        user_tasks = db.exec(
            select(Task)
            .where(Task.assigned_to == u.id)
            .where(Task.status == "COMPLETED")
        ).all()
        score = 0.0
        for t in user_tasks:
            score += 10.0
            if t.due_date and t.completed_at:
                try:
                    due_dt = datetime.strptime(t.due_date, "%Y-%m-%d")
                    if t.completed_at.date() <= due_dt.date():
                        score += 5.0
                except Exception:
                    pass
        u.performance_score = score
        db.add(u)
    db.commit()

    # 5. Team performance score (FR-088)
    if project and project.team_id:
        team = db.get(Team, project.team_id)
        if team:
            members = db.exec(
                select(TeamMember)
                .where(TeamMember.team_id == team.id)
                .where(TeamMember.designation != "mentor")
            ).all()
            if members:
                scores = []
                for m in members:
                    mu = db.get(User, m.user_id)
                    if mu:
                        scores.append(mu.performance_score)
                team.performance_score = sum(scores) / len(scores) if scores else 0.0
            else:
                team.performance_score = 0.0
            db.add(team)
            db.commit()


# --------------------------------------------------------------------------- #
#  CRUD Endpoints                                                              #
# --------------------------------------------------------------------------- #

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskOut)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """Create a project task (Team Leader only — BR-008)."""
    project = db.get(Project, task_in.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    if not project.team_id:
        raise HTTPException(status_code=400, detail="No team assigned to this project yet")

    # Verify current user is the Team Leader of this project's team
    tl_member = db.exec(
        select(TeamMember)
        .where(TeamMember.team_id == project.team_id)
        .where(TeamMember.user_id == current_user.id)
        .where(TeamMember.designation == "lead")
    ).first()
    if not tl_member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the Team Leader can create tasks (BR-008)")

    # Verify phase is unlocked (SRS 3.7.2)
    phase = db.get(ProjectPhase, task_in.phase_id)
    if not phase or phase.project_id != project.id:
        raise HTTPException(status_code=404, detail="Project phase not found")
    if not phase.is_unlocked:
        raise HTTPException(status_code=400, detail="Cannot create tasks in a locked SDLC phase")

    # Verify assignee belongs to the project team (BR-009)
    assignee_member = db.exec(
        select(TeamMember)
        .where(TeamMember.team_id == project.team_id)
        .where(TeamMember.user_id == task_in.assigned_to)
    ).first()
    if not assignee_member:
        raise HTTPException(status_code=400, detail="Assigned developer must belong to the project team")

    task = Task(
        id=str(uuid.uuid4()),
        project_id=task_in.project_id,
        phase_id=phase.id,
        assigned_to=task_in.assigned_to,
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        status="PENDING",
        created_by=current_user.id,
    )
    db.add(task)

    # Notify assignee (SRS 3.13.3 — TASK_ASSIGNED)
    db.add(Notification(
        id=str(uuid.uuid4()),
        user_id=task_in.assigned_to,
        title="New Task Assigned",
        message=f"You have been assigned: '{task_in.title}' in {phase.name} phase.",
        event_type="TASK_ASSIGNED",
        related_entity_type="task",
        related_entity_id=task.id,
    ))

    # Audit log (SRS 3.16)
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="TASK_CREATED",
        description=f"Task '{task_in.title}' created in {phase.name} phase.",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="task",
        related_entity_id=task.id,
    ))

    db.commit()
    db.refresh(task)
    recalculate_metrics(task.project_id, db)
    return task


@router.get("/", response_model=List[TaskOut])
def list_tasks(
    project_id: Optional[str] = None,
    assigned_to: Optional[str] = None,
    status: Optional[str] = None,
    phase_id: Optional[str] = None,
    db: Session = Depends(deps.get_db),
) -> Any:
    query = select(Task)
    if project_id:
        query = query.where(Task.project_id == project_id)
    if assigned_to:
        query = query.where(Task.assigned_to == assigned_to)
    if status:
        query = query.where(Task.status == status.upper())
    if phase_id:
        query = query.where(Task.phase_id == phase_id)
    return db.exec(query).all()


@router.get("/{id}", response_model=TaskOut)
def get_task(id: str, db: Session = Depends(deps.get_db)) -> Any:
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.patch("/{id}/status", response_model=TaskOut)
def update_task_status(
    id: str,
    status: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update task status to PENDING or IN_PROGRESS.
    Allowed by: assignee or Team Leader (SRS 3.8.2).
    """
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    new_status = status.upper()
    if new_status not in ["PENDING", "IN_PROGRESS"]:
        raise HTTPException(
            status_code=400,
            detail="Use PENDING or IN_PROGRESS. To submit for review use /submit endpoint."
        )

    # Auth check
    is_tl = False
    project = db.get(Project, task.project_id)
    if project and project.team_id:
        tl = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.user_id == current_user.id)
            .where(TeamMember.designation == "lead")
        ).first()
        is_tl = tl is not None

    if task.assigned_to != current_user.id and current_user.role != "admin" and not is_tl:
        raise HTTPException(status_code=403, detail="Not authorised to update this task's status")

    old_status = task.status
    task.status = new_status
    task.rejection_remarks = None
    task.updated_at = datetime.utcnow()
    db.add(task)

    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="TASK_STATUS_UPDATED",
        description=f"Task '{task.title}' status: {old_status} → {new_status}",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="task",
        related_entity_id=task.id,
    ))

    db.commit()
    db.refresh(task)
    return task


@router.post("/{id}/submit", response_model=TaskOut)
def submit_task(
    id: str,
    submission: TaskSubmit,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Developer submits completed task for Mentor verification (FR-072, BR-010).
    Moves status to PENDING_VERIFICATION.
    """
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned developer can submit")

    task.status = "PENDING_VERIFICATION"
    task.submission_url = submission.submission_url
    task.submission_demo_url = submission.submission_demo_url
    task.submitted_at = datetime.utcnow()
    task.rejection_remarks = None
    task.updated_at = datetime.utcnow()
    db.add(task)

    project = db.get(Project, task.project_id)
    if project and project.team_id:
        # Notify Team Leader
        tl = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.designation == "lead")
        ).first()
        if tl:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=tl.user_id,
                title="Task Awaiting Verification",
                message=f"{current_user.name} submitted task: '{task.title}' for review.",
                event_type="TASK_STATUS_UPDATED",
                related_entity_type="task",
                related_entity_id=task.id,
            ))

        # Notify Mentor
        mentor = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.designation == "mentor")
        ).first()
        if mentor:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=mentor.user_id,
                title="Review Submitted Task",
                message=f"Task '{task.title}' from {project.name} is ready for your review.",
                event_type="TASK_STATUS_UPDATED",
                related_entity_type="task",
                related_entity_id=task.id,
            ))

    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="TASK_STATUS_UPDATED",
        description=f"Task '{task.title}' submitted for Mentor verification.",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="task",
        related_entity_id=task.id,
    ))

    db.commit()
    db.refresh(task)
    return task


@router.post("/{id}/verify", response_model=TaskOut)
def verify_task(
    id: str,
    verify_in: TaskVerify,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mentor verifies or rejects a task submission (FR-074, FR-075, BR-011, BR-012).
    VERIFY → COMPLETED (officially completed, progress recalculated).
    REJECT → IN_PROGRESS (returned with remarks, submission cleared).
    """
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project = db.get(Project, task.project_id)
    if not project or not project.team_id:
        raise HTTPException(status_code=400, detail="Project team not found")

    # Only the assigned Mentor (or Admin) can verify
    mentor_member = db.exec(
        select(TeamMember)
        .where(TeamMember.team_id == project.team_id)
        .where(TeamMember.user_id == current_user.id)
        .where(TeamMember.designation == "mentor")
    ).first()
    if not mentor_member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the assigned Mentor can verify tasks")

    decision = verify_in.decision.upper()

    if decision == "VERIFY":
        task.status = "COMPLETED"
        task.verified_at = datetime.utcnow()
        task.verified_by = current_user.id
        task.completed_at = datetime.utcnow()       # FR-071: auto-record completion time
        task.rejection_remarks = None
        task.updated_at = datetime.utcnow()
        db.add(task)
        db.commit()

        # Recalculate all metrics (BR-013, BR-014)
        recalculate_metrics(project.id, db)

        # Notify developer
        db.add(Notification(
            id=str(uuid.uuid4()),
            user_id=task.assigned_to,
            title="Task Verified ✓",
            message=f"Your task '{task.title}' has been verified by {current_user.name}.",
            event_type="TASK_VERIFIED",
            related_entity_type="task",
            related_entity_id=task.id,
        ))

        # Notify Team Leader
        tl = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.designation == "lead")
        ).first()
        if tl:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=tl.user_id,
                title="Team Task Completed",
                message=f"Task '{task.title}' has been verified by {current_user.name}.",
                event_type="TASK_VERIFIED",
                related_entity_type="task",
                related_entity_id=task.id,
            ))

        db.add(AuditLog(
            id=str(uuid.uuid4()),
            event_type="TASK_VERIFIED",
            description=f"Task '{task.title}' verified and marked COMPLETED.",
            performed_by=current_user.id,
            user_role=current_user.role,
            related_module="task",
            related_entity_id=task.id,
        ))

    elif decision == "REJECT":
        task.status = "IN_PROGRESS"               # FR-076: return to In Progress
        task.rejection_remarks = verify_in.remarks or "Rejected by Mentor"
        task.submission_url = None
        task.submission_demo_url = None
        task.submitted_at = None
        task.updated_at = datetime.utcnow()
        db.add(task)

        # Notify developer
        db.add(Notification(
            id=str(uuid.uuid4()),
            user_id=task.assigned_to,
            title="Task Rejected",
            message=f"Your task '{task.title}' was rejected. Remarks: {task.rejection_remarks}",
            event_type="TASK_REJECTED",
            related_entity_type="task",
            related_entity_id=task.id,
        ))

        # Notify Team Leader
        tl = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.designation == "lead")
        ).first()
        if tl:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=tl.user_id,
                title="Task Rejected by Mentor",
                message=f"Task '{task.title}' was rejected. Returned to In Progress.",
                event_type="TASK_REJECTED",
                related_entity_type="task",
                related_entity_id=task.id,
            ))

        db.add(AuditLog(
            id=str(uuid.uuid4()),
            event_type="TASK_REJECTED",
            description=f"Task '{task.title}' rejected by Mentor. Remarks: {task.rejection_remarks}",
            performed_by=current_user.id,
            user_role=current_user.role,
            related_module="task",
            related_entity_id=task.id,
        ))

    else:
        raise HTTPException(status_code=400, detail="Invalid decision. Use 'VERIFY' or 'REJECT'")

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{id}")
def delete_task(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    project_id = task.project_id
    task_title = task.title
    db.delete(task)

    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="TASK_STATUS_UPDATED",
        description=f"Task '{task_title}' deleted by admin.",
        performed_by=current_admin.id,
        user_role="admin",
        related_module="task",
        related_entity_id=id,
    ))

    db.commit()
    recalculate_metrics(project_id, db)
    return {"status": "SUCCESS", "message": "Task deleted and metrics recalculated"}
