from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
import uuid

from ...api import deps
from ...models.models import Project, Team, User, Member

router = APIRouter()

class ProjectCreate(BaseModel):
    name: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    status: Optional[str] = "DRAFT"
    type: Optional[str] = "Web_App"
    deadline: Optional[str] = "2026-12-31"
    academicYear: Optional[str] = "2025-26"
    gitHubRepo: Optional[str] = None
    teamId: Optional[str] = None

@router.post("/projects", status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_admin),
) -> Any:
    project_id = str(uuid.uuid4())
    project = Project(
        id=project_id,
        name=project_in.name,
        short_description=project_in.short_description,
        full_description=project_in.full_description,
        status=project_in.status,
        created_by=current_user.id,
        type=project_in.type,
        deadline=project_in.deadline,
        academic_year=project_in.academicYear,
        github_repo=project_in.gitHubRepo,
        team_id=project_in.teamId
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.get("/projects", response_model=List[Project])
def list_projects(
    db: Session = Depends(deps.get_db),
) -> Any:
    return db.exec(select(Project)).all()

@router.get("/projects/{projectId}", response_model=Project)
def get_project(
    projectId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/projects/{projectId}")
def delete_project(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"status": "SUCCESS", "message": "Project deleted"}
