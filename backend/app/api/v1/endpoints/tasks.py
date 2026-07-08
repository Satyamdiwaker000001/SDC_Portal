from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
from datetime import datetime

from ....api import deps
from ....models.models import Task, User, Project, ProjectPhase, TeamMember, Team, Notification, ActivityLog

router = APIRouter()

class TaskCreate(BaseModel):
    project_id: str
    phase_id: str
    assigned_to: str
    title: str
    description: Optional[str] = None
    due_date: Optional[str] = None

class TaskOut(BaseModel):
    id: str
    project_id: str
    parent_task_id: Optional[str]
    assigned_to: Optional[str]
    title: str
    description: Optional[str]
    status: str
    phase_id: Optional[str]
    phase_name: Optional[str]
    submission_url: Optional[str]
    submission_demo_url: Optional[str]
    due_date: Optional[str]
    submitted_at: Optional[datetime]
    verified_at: Optional[datetime]
    verified_by: Optional[str]
    rejection_remarks: Optional[str]
    created_at: datetime

class TaskSubmit(BaseModel):
    submission_url: str
    submission_demo_url: Optional[str] = None

class TaskVerify(BaseModel):
    decision: str # 'VERIFY' or 'REJECT'
    remarks: Optional[str] = None

def recalculate_metrics(project_id: str, db: Session):
    """
    Recalculates progress for SDLC phases and the overall project.
    Also recalculates developer and team performance scores.
    """
    # 1. Recalculate Phase Progresses
    phases = db.exec(select(ProjectPhase).where(ProjectPhase.project_id == project_id)).all()
    all_phases_completed = True
    
    for phase in phases:
        tasks_in_phase = db.exec(select(Task).where(Task.phase_id == phase.id)).all()
        if not tasks_in_phase:
            # If no tasks, progress is 100% or 0% depending on completion status
            phase.progress = 100 if phase.is_completed else 0
        else:
            completed_tasks = [t for t in tasks_in_phase if t.status == "COMPLETED"]
            phase.progress = int((len(completed_tasks) / len(tasks_in_phase)) * 100)
            
            # Mark phase completed if all tasks are COMPLETED
            if len(completed_tasks) == len(tasks_in_phase):
                phase.is_completed = True
            else:
                phase.is_completed = False
                all_phases_completed = False
                
        phase.updated_at = datetime.utcnow()
        db.add(phase)
        
    db.commit()
    
    # 2. Sequential Phase Unlocking Logic (3.7.2 / BR-007)
    # Check if a completed phase should unlock the next sequence phase
    phases = sorted(phases, key=lambda p: p.sequence)
    for i in range(len(phases) - 1):
        current_p = phases[i]
        next_p = phases[i + 1]
        if current_p.is_completed and not next_p.is_unlocked:
            next_p.is_unlocked = True
            next_p.updated_at = datetime.utcnow()
            db.add(next_p)
            
            # Log auto phase unlock
            audit = ActivityLog(
                id=str(uuid.uuid4()),
                user_id="SYSTEM",
                entity_type="phase",
                entity_id=next_p.id,
                action=f"PHASE_AUTO_UNLOCK: {next_p.name} (Preceding completed)",
                is_audit=True,
                created_at=datetime.utcnow()
            )
            db.add(audit)
            
    db.commit()
    
    # 3. Recalculate Overall Project Progress
    all_project_tasks = db.exec(select(Task).where(Task.project_id == project_id)).all()
    project = db.get(Project, project_id)
    if project:
        if all_project_tasks:
            completed_project_tasks = [t for t in all_project_tasks if t.status == "COMPLETED"]
            project.progress = int((len(completed_project_tasks) / len(all_project_tasks)) * 100)
            if len(completed_project_tasks) == len(all_project_tasks) and all_phases_completed:
                project.status = "COMPLETED"
        else:
            project.progress = 0
        db.add(project)
        db.commit()
        
    # 4. Recalculate Developer Performance Scores (BR-014)
    # Developer Performance = sum of points for verified completed tasks
    # Verified task = 10 pts. +5 pts if completed on/before due date.
    all_users = db.exec(select(User).where(User.role == "developer")).all()
    for u in all_users:
        user_tasks = db.exec(select(Task).where(Task.assigned_to == u.id).where(Task.status == "COMPLETED")).all()
        score = 0.0
        for t in user_tasks:
            score += 10.0
            if t.due_date and t.verified_at:
                try:
                    due_dt = datetime.strptime(t.due_date, "%Y-%m-%d")
                    # Compare date parts only
                    if t.verified_at.date() <= due_dt.date():
                        score += 5.0 # Timely delivery bonus
                except Exception:
                    pass
        u.performance_score = score
        db.add(u)
    db.commit()
    
    # 5. Recalculate Team Performance Scores (BR-014)
    # Team Performance = Average performance score of active members
    if project and project.team_id:
        team = db.get(Team, project.team_id)
        if team:
            members = db.exec(select(TeamMember).where(TeamMember.team_id == team.id).where(TeamMember.designation != "mentor")).all()
            if members:
                total_score = 0.0
                member_count = 0
                for m in members:
                    m_user = db.get(User, m.user_id)
                    if m_user:
                        total_score += m_user.performance_score
                        member_count += 1
                team.performance_score = (total_score / member_count) if member_count > 0 else 0.0
            else:
                team.performance_score = 0.0
            db.add(team)
            db.commit()

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskOut)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a project task (Team Leader only - BR-054 / BR-008).
    """
    project = db.get(Project, task_in.project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Verify current user is the Team Leader of the project's assigned team
    if not project.team_id:
        raise HTTPException(status_code=400, detail="No team assigned to this project yet")
        
    tl_member = db.exec(
        select(TeamMember)
        .where(TeamMember.team_id == project.team_id)
        .where(TeamMember.user_id == current_user.id)
        .where(TeamMember.designation == "lead")
    ).first()
    
    if not tl_member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the Team Leader of this project can create tasks")

    # Verify task belongs to an unlocked phase
    phase = db.get(ProjectPhase, task_in.phase_id)
    if not phase or phase.project_id != project.id:
        raise HTTPException(status_code=404, detail="Project phase not found")
        
    if not phase.is_unlocked:
        raise HTTPException(status_code=400, detail="Cannot create tasks inside a locked SDLC phase")

    # Verify assigned developer is on the same team
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
        phase_name=phase.name,
        assigned_to=task_in.assigned_to,
        title=task_in.title,
        description=task_in.description,
        due_date=task_in.due_date,
        status="PENDING", # Default status
        created_by=current_user.id
    )
    db.add(task)
    
    # Create notification for assignee
    notif = Notification(
        id=str(uuid.uuid4()),
        user_id=task_in.assigned_to,
        title="New Task Assigned",
        message=f"You have been assigned a new task: {task_in.title} in {phase.name} phase.",
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notif)
    
    # Log in Audit
    audit = ActivityLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        entity_type="task",
        entity_id=task.id,
        action=f"TASK_CREATE: {task_in.title}",
        is_audit=False,
        created_at=datetime.utcnow()
    )
    db.add(audit)
    
    db.commit()
    db.refresh(task)
    return task

@router.get("/", response_model=List[TaskOut])
def list_tasks(
    project_id: Optional[str] = None,
    assigned_to: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(deps.get_db),
) -> Any:
    query = select(Task)
    if project_id:
        query = query.where(Task.project_id == project_id)
    if assigned_to:
        query = query.where(Task.assigned_to == assigned_to)
    if status:
        query = query.where(Task.status == status.upper())
    return db.exec(query).all()

@router.get("/{id}", response_model=TaskOut)
def get_task(
    id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
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
    Allow Developer or TL to update status to 'IN_PROGRESS' or 'PENDING'.
    """
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    # Check authorization (must be assignee or TL)
    is_tl = False
    project = db.get(Project, task.project_id)
    if project and project.team_id:
        tl_member = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.user_id == current_user.id)
            .where(TeamMember.designation == "lead")
        ).first()
        is_tl = tl_member is not None

    if task.assigned_to != current_user.id and current_user.role != "admin" and not is_tl:
        raise HTTPException(status_code=403, detail="Not authorized to update status of this task")

    old_status = task.status
    task.status = status.upper()
    task.rejection_remarks = None # clear any remarks on status change
    db.add(task)
    
    # Audit log
    audit = ActivityLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        entity_type="task",
        entity_id=task.id,
        action=f"TASK_STATUS_UPDATE: {old_status} -> {task.status}",
        is_audit=False,
        created_at=datetime.utcnow()
    )
    db.add(audit)
    
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
    Developer submits completed task for Mentor Verification (FR-072 / BR-010).
    """
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    if task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Only the assigned developer can submit this task")

    task.status = "PENDING_VERIFICATION"
    task.submission_url = submission.submission_url
    task.submission_demo_url = submission.submission_demo_url
    task.submitted_at = datetime.utcnow()
    task.rejection_remarks = None
    db.add(task)
    
    # Notify TL & Mentor
    project = db.get(Project, task.project_id)
    if project and project.team_id:
        # Notify Team Leader
        tl = db.exec(select(TeamMember).where(TeamMember.team_id == project.team_id).where(TeamMember.designation == "lead")).first()
        if tl:
            notif_tl = Notification(
                id=str(uuid.uuid4()),
                user_id=tl.user_id,
                title="Task Awaiting Verification",
                message=f"{current_user.name} submitted task: {task.title} for review.",
                is_read=False,
                created_at=datetime.utcnow()
            )
            db.add(notif_tl)
            
        # Notify Mentor
        mentor = db.exec(select(TeamMember).where(TeamMember.team_id == project.team_id).where(TeamMember.designation == "mentor")).first()
        if mentor:
            notif_mentor = Notification(
                id=str(uuid.uuid4()),
                user_id=mentor.user_id,
                title="Review Submitted Task",
                message=f"New task submission: {task.title} from team {project.name}.",
                is_read=False,
                created_at=datetime.utcnow()
            )
            db.add(notif_mentor)

    # Log in Audit
    audit = ActivityLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        entity_type="task",
        entity_id=task.id,
        action="TASK_SUBMIT",
        is_audit=False,
        created_at=datetime.utcnow()
    )
    db.add(audit)

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
    Mentor verifies or rejects task (Mentor only - FR-074 / FR-075 / BR-011 / BR-012).
    """
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    project = db.get(Project, task.project_id)
    if not project or not project.team_id:
        raise HTTPException(status_code=400, detail="Project team not found")
        
    # Check if current_user is the Mentor of the project team
    mentor_member = db.exec(
        select(TeamMember)
        .where(TeamMember.team_id == project.team_id)
        .where(TeamMember.user_id == current_user.id)
        .where(TeamMember.designation == "mentor")
    ).first()
    
    if not mentor_member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the assigned Mentor can verify/reject completed tasks")

    decision = verify_in.decision.upper()
    if decision == "VERIFY":
        task.status = "COMPLETED"
        task.verified_at = datetime.utcnow()
        task.verified_by = current_user.id
        task.rejection_remarks = None
        
        # Recalculate all progress metrics and developer performance scores
        db.add(task)
        db.commit()
        recalculate_metrics(project.id, db)
        
        # Create notifications
        if task.assigned_to:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=task.assigned_to,
                title="Task Verified",
                message=f"Congratulations! Your task '{task.title}' has been verified by {current_user.name}.",
                is_read=False,
                created_at=datetime.utcnow()
            ))
            
        tl = db.exec(select(TeamMember).where(TeamMember.team_id == project.team_id).where(TeamMember.designation == "lead")).first()
        if tl:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=tl.user_id,
                title="Team Task Completed",
                message=f"Task '{task.title}' assigned to developer was verified by {current_user.name}.",
                is_read=False,
                created_at=datetime.utcnow()
            ))
            
    elif decision == "REJECT":
        task.status = "IN_PROGRESS" # Return to In Progress (FR-076 / BR-012)
        task.rejection_remarks = verify_in.remarks or "Rejected by Mentor"
        task.submission_url = None # clear submission
        task.submission_demo_url = None
        db.add(task)
        
        # Create notifications
        if task.assigned_to:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=task.assigned_to,
                title="Task Rejected",
                message=f"Your task '{task.title}' was rejected by {current_user.name}. Remarks: {task.rejection_remarks}",
                is_read=False,
                created_at=datetime.utcnow()
            ))
            
        tl = db.exec(select(TeamMember).where(TeamMember.team_id == project.team_id).where(TeamMember.designation == "lead")).first()
        if tl:
            db.add(Notification(
                id=str(uuid.uuid4()),
                user_id=tl.user_id,
                title="Task Rejected by Mentor",
                message=f"Task '{task.title}' was rejected. Returned to In Progress.",
                is_read=False,
                created_at=datetime.utcnow()
            ))
            
    else:
        raise HTTPException(status_code=400, detail="Invalid decision. Choose 'VERIFY' or 'REJECT'")
        
    # Log in Audit
    audit = ActivityLog(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        entity_type="task",
        entity_id=task.id,
        action=f"TASK_VERIFICATION: {decision}",
        is_audit=False,
        created_at=datetime.utcnow()
    )
    db.add(audit)
    
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
    db.delete(task)
    
    # Audit log
    audit = ActivityLog(
        id=str(uuid.uuid4()),
        user_id=current_admin.id,
        entity_type="task",
        entity_id=id,
        action=f"TASK_DELETE",
        is_audit=True,
        created_at=datetime.utcnow()
    )
    db.add(audit)
    
    db.commit()
    recalculate_metrics(project_id, db)
    return {"status": "SUCCESS", "message": "Task deleted and metrics recalculated"}
