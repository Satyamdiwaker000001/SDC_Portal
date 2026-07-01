from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
from ....api import deps
from ....models.models import Task, User

router = APIRouter()

class TaskCreate(BaseModel):
    project_id: str
    parent_task_id: Optional[str] = None
    assigned_to: Optional[str] = None
    title: str
    description: Optional[str] = None

class TaskOut(BaseModel):
    id: str
    project_id: str
    parent_task_id: Optional[str]
    assigned_to: Optional[str]
    title: str
    description: Optional[str]
    status: str
    submission_url: Optional[str]
    submission_demo_url: Optional[str]

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TaskOut)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    task = Task(
        id=str(uuid.uuid4()),
        project_id=task_in.project_id,
        parent_task_id=task_in.parent_task_id,
        assigned_to=task_in.assigned_to,
        title=task_in.title,
        description=task_in.description,
        created_by=current_user.id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/", response_model=List[TaskOut])
def list_tasks(
    project_id: Optional[str] = None,
    db: Session = Depends(deps.get_db),
) -> Any:
    query = select(Task)
    if project_id:
        query = query.where(Task.project_id == project_id)
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
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status.upper()
    db.add(task)
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
    db.delete(task)
    db.commit()
    return {"status": "SUCCESS", "message": "Task deleted"}
