from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload

from ....api import deps
from ....models.models import Project, Task, Team, User, Member
from ....schemas.project import (
    ProjectCreate, ProjectUpdate, ProjectOut, TaskCreate, TaskOut, 
    ProjectBulkCreate, ProjectActivation, TaskReview, ProjectAdminPatch
)
from ....core.utils import generate_scifi_id

router = APIRouter()

@router.get("/public/showcase")
def public_project_reveal(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Public registry of LIVE projects for landing page visitors.
    No authentication required.
    """
    # Fetch LIVE projects with their teams and members
    statement = select(Project).where(Project.status == "LIVE")
    projects = db.exec(statement).all()
    
    result = []
    for p in projects:
        # Resolve team operatives
        team_name = "UNASSIGNED"
        operatives = []
        if p.team:
            team_name = p.team.name
            operatives = [{"name": m.name, "role": m.spec} for m in p.team.members]
            
        result.append({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "type": p.type,
            "team": team_name,
            "operatives": operatives
        })
        
    return result

@router.get("/", response_model=List[ProjectOut])
def read_projects(
    db: Session = Depends(deps.get_db),
    status: Optional[str] = None,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve projects.
    """
    statement = select(Project)
    if status:
        statement = statement.where(Project.status == status)
    return db.exec(statement).all()

@router.post("/", response_model=ProjectOut)
def create_project(
    *,
    db: Session = Depends(deps.get_db),
    project_in: ProjectCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new forge (Admin only).
    """
    project_id = project_in.id or generate_scifi_id(project_in.name)
    
    project = Project(
        id=project_id,
        name=project_in.name,
        description=project_in.description,
        type=project_in.type,
        status="PENDING",
        deadline=project_in.deadline,
        teamId=project_in.teamId
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{id}", response_model=ProjectOut)
def read_project_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get project detail by ID.
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.patch("/{id}/progress", response_model=ProjectOut)
def update_project_progress(
    id: str,
    db: Session = Depends(deps.get_db),
) -> None:
    """
    Internal helper to synchronize project progress based on DONE tasks.
    """
    project = db.get(Project, id)
    if not project:
        return
    
    total_tasks = len(project.tasks)
    if total_tasks == 0:
        project.progress = 0
    else:
        done_tasks = len([t for t in project.tasks if t.status == "DONE"])
        project.progress = int((done_tasks / total_tasks) * 100)
    
    db.add(project)
    db.commit()

@router.patch("/{id}/deadline", response_model=ProjectOut)
def extend_project_deadline(
    id: str,
    new_deadline: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Temporal override: Adjust project deadline (Admin only).
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.deadline = new_deadline
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/{id}/tasks", response_model=List[TaskOut])
def read_project_tasks(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve project matrix tasks.
    """
    tasks = db.exec(select(Task).where(Task.project_id == id)).all()
    return tasks

@router.post("/{id}/tasks", response_model=TaskOut)
def create_project_task(
    id: str,
    task_in: TaskCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Add task to project matrix (Leader only).
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if current_user is Leader
    if not project.team or project.team.leaderId != current_user.id:
        if current_user.role != "admin": # Admin can always add
            raise HTTPException(status_code=403, detail="Operational denial: Only team leaders can forge tasks")

    task = Task(
        id=task_in.id,
        moduleName=task_in.moduleName,
        title=task_in.title,
        assignedTo=task_in.assignedTo,
        status="TODO",
        project_id=id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Sync progress
    update_project_progress(id, db)
    return task

@router.patch("/tasks/{task_id}/status", response_model=TaskOut)
def update_task_status_protocol(
    task_id: str,
    status: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update task status with hierarchical review logic.
    """
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not detected")
    
    # Logic: Leader vs Member
    project = task.project
    is_leader = project.team and project.team.leaderId == current_user.id
    
    if status == "DONE":
        if is_leader and task.assignedTo == current_user.id:
            # Leader completing their own task -> Instant DONE
            task.status = "DONE"
            task.reviewFeedback = None
        else:
            # Member or Leader completing others -> REVIEW_PENDING
            task.status = "REVIEW_PENDING"
    else:
        # Other status updates (TODO -> IN_PROGRESS etc)
        task.status = status

    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Sync progress
    update_project_progress(task.project_id, db)
    return task

@router.patch("/tasks/{task_id}/review", response_model=TaskOut)
def task_review_protocol(
    task_id: str,
    review: TaskReview,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Hierarchical quality gate (Leader only).
    """
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not detected")
    
    project = task.project
    if not project.team or project.team.leaderId != current_user.id:
        raise HTTPException(status_code=403, detail="Authority denied: Only leaders can review tasks")

    if review.action == "APPROVE":
        task.status = "DONE"
        task.reviewFeedback = None
    elif review.action == "REJECT":
        task.status = "TODO" # Reactive status
        predefined = "You assigned work not completed yet, check again and then mark done for review your work."
        task.reviewFeedback = review.feedback or predefined
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    # Sync progress
    update_project_progress(task.project_id, db)
    return task

@router.post("/bulk")
def bulk_forge_projects(
    *,
    db: Session = Depends(deps.get_db),
    bulk_in: ProjectBulkCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Mass project registry (Admin only).
    """
    added_ids = []
    for p_in in bulk_in.projects:
        p_id = p_in.id or generate_scifi_id(p_in.name)
        project = Project(
            id=p_id,
            name=p_in.name,
            description=p_in.description,
            type=p_in.type,
            status="PENDING",
            deadline=p_in.deadline
        )
        db.add(project)
        added_ids.append(p_id)
    db.commit()
    return {"status": "SUCCESS", "ids": added_ids}

@router.patch("/{id}/activate", response_model=ProjectOut)
def activate_project_protocol(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Go LIVE: Activates project and sync-forges a Team.
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.status = "LIVE"
    db.add(project)

    # Auto-provision Team with matching Identity
    existing_team = db.get(Team, id)
    if not existing_team:
        # Default leader as the current admin for now, or leave empty if schema allows
        # Based on Team model, leaderId is foreign_key="member.id"
        # We might need to ask for leaderId or use a placeholder
        # For now, we search for a member with same id if it exists or leave it
        new_team = Team(
            id=id,
            name=project.name,
            leaderId=current_admin.id # Defaulting to admin's member ID if they are a member
        )
        db.add(new_team)
        project.teamId = new_team.id
    
    db.commit()
    db.refresh(project)
    return project

@router.post("/bulk-activate")
def bulk_activate_protocol(
    *,
    db: Session = Depends(deps.get_db),
    activation_in: ProjectActivation,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Mass activation of projects.
    """
    for p_id in activation_in.project_ids:
        project = db.get(Project, p_id)
        if project and project.status != "LIVE":
            project.status = "LIVE"
            db.add(project)
            
            if not db.get(Team, p_id):
                new_team = Team(id=p_id, name=project.name, leaderId=current_admin.id)
                db.add(new_team)
                project.teamId = new_team.id
    db.commit()
    return {"status": "SUCCESS", "activated_count": len(activation_in.project_ids)}

@router.patch("/{id}/submit-final", response_model=ProjectOut)
def submit_project_for_final_audit(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Matrix Finalization: Submit project for Admin review (Leader only).
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not detected")
    
    if not project.team or project.team.leaderId != current_user.id:
        raise HTTPException(status_code=403, detail="Operational denial: Only team leaders can submit for final audit")

    # Verify all tasks are DONE
    undone = [t for t in project.tasks if t.status != "DONE"]
    if undone:
        raise HTTPException(status_code=400, detail=f"Matrix incomplete: {len(undone)} tasks still pending")

    project.status = "PENDING_ADMIN"
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.patch("/{id}/finalize", response_model=ProjectOut)
def admin_finalize_project(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Project Genesis: Mark project as COMPLETED (Admin only).
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not detected")
    
    project.status = "COMPLETED"
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{id}")
def delete_project(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Terminate project data (Admin only).
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"status": "FORGE_TERMINATED"}
