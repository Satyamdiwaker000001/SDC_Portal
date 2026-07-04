from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
from ....api import deps
from ....models.models import Project, User

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    type: Optional[str] = "Web_App"
    deadline: Optional[str] = "2026-12-31"
    academic_year: Optional[str] = "2025-26"
    team_id: Optional[str] = None
    github_repo: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None

class ProjectOut(BaseModel):
    id: str
    name: str
    short_description: Optional[str]
    status: str
    type: str
    deadline: str
    academic_year: str
    team_id: Optional[str]
    github_repo: Optional[str]
    live_url: Optional[str]
    image_url: Optional[str]
    is_featured: bool
    progress: int

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProjectOut)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    project = Project(
        id=str(uuid.uuid4()),
        name=project_in.name,
        short_description=project_in.short_description,
        full_description=project_in.full_description,
        type=project_in.type,
        deadline=project_in.deadline,
        academic_year=project_in.academic_year,
        team_id=project_in.team_id,
        github_repo=project_in.github_repo,
        live_url=project_in.live_url,
        image_url=project_in.image_url,
        created_by=current_admin.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/", response_model=List[ProjectOut])
def list_projects(
    db: Session = Depends(deps.get_db),
) -> Any:
    return db.exec(select(Project)).all()

@router.get("/{id}", response_model=ProjectOut)
def get_project(
    id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.patch("/{id}/status", response_model=ProjectOut)
def update_project_status(
    id: str,
    status: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project.status = status.upper()
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    type: Optional[str] = None
    deadline: Optional[str] = None
    academic_year: Optional[str] = None
    team_id: Optional[str] = None
    github_repo: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None

@router.patch("/{id}", response_model=ProjectOut)
def update_project(
    id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "status" and value:
            setattr(project, key, value.upper())
        else:
            setattr(project, key, value)
            
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
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Delete associated tasks to prevent foreign key errors
    from ....models.models import Task
    tasks = db.exec(select(Task).where(Task.project_id == id)).all()
    for task in tasks:
        db.delete(task)
        
    db.delete(project)
    db.commit()
    return {"status": "SUCCESS", "message": "Project and its tasks deleted"}
