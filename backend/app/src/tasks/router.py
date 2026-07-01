from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
import uuid

from ...api import deps
from ...models.models import Task, User, Project, Team

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "TODO"
    assigned_to: Optional[str] = None
    module_id: str  # Kept as alias to project_id in Pydantic to avoid breaking existing clients

@router.post("/tasks", status_code=status.HTTP_201_CREATED)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    project = db.get(Project, task_in.module_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    task = Task(
        id=str(uuid.uuid4()),
        project_id=task_in.module_id,
        assigned_to=task_in.assigned_to,
        created_by=current_user.id,
        title=task_in.title,
        description=task_in.description,
        status=task_in.status
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.get("/tasks", response_model=List[Task])
def list_tasks(
    db: Session = Depends(deps.get_db),
) -> Any:
    return db.exec(select(Task)).all()

@router.get("/tasks/{taskId}", response_model=Task)
def get_task(
    taskId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.delete("/tasks/{taskId}")
def delete_task(
    taskId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    task = db.get(Task, taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"status": "SUCCESS", "message": "Task deleted"}
