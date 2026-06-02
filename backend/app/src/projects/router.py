from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
from datetime import datetime

from ...api import deps
from ...models.models import Project, Team, SRS, Module, User, Member

router = APIRouter()

class ProjectCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    type: str
    deadline: str
    academicYear: Optional[str] = "2024-25"
    gitHubRepo: Optional[str] = None

class AssignTeamRequest(BaseModel):
    teamId: str

class SRSSubmitRequest(BaseModel):
    content: str # Document link or content description

class SRSReviewRequest(BaseModel):
    remarks: Optional[str] = None

class ModuleCreate(BaseModel):
    id: str
    name: str
    description: Optional[str] = None

class ModuleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

@router.post("/admin/projects", status_code=status.HTTP_201_CREATED)
def create_project(
    proj_in: ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new project (Admin only)
    """
    existing = db.get(Project, proj_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Project ID already exists")
        
    project = Project(
        id=proj_in.id,
        name=proj_in.name,
        description=proj_in.description,
        type=proj_in.type,
        status="DRAFT",
        deadline=proj_in.deadline,
        academicYear=proj_in.academicYear,
        gitHubRepo=proj_in.gitHubRepo,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"status": "SUCCESS", "project": project}

@router.get("/projects")
def get_projects(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get projects with role based access
    """
    if current_user.role == "admin" or current_user.role == "mentor":
        return db.exec(select(Project)).all()
        
    # Developers see projects assigned to their teams
    # Query developer's member profile to find their teams
    member = db.get(Member, current_user.id)
    if not member:
        return []
    team_ids = [t.id for t in member.teams]
    if not team_ids:
        return []
        
    statement = select(Project).where(Project.teamId.in_(team_ids))
    return db.exec(statement).all()

@router.get("/projects/{projectId}")
def project_details(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get detailed information about a project
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.delete("/admin/projects/{projectId}")
def delete_project(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete project (Admin only)
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"status": "SUCCESS", "message": "Project deleted"}

@router.post("/admin/projects/{projectId}/teams")
def assign_team_to_project(
    projectId: str,
    request: AssignTeamRequest,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Assign a development Team to a Project (Admin only)
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    team = db.get(Team, request.teamId)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    project.teamId = request.teamId
    db.add(project)
    db.commit()
    return {"status": "SUCCESS", "message": "Team assigned to project"}

@router.delete("/admin/projects/{projectId}/teams/{teamId}")
def remove_team_from_project(
    projectId: str,
    teamId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Remove Team assignment from Project (Admin only)
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    if project.teamId != teamId:
        raise HTTPException(status_code=400, detail="Team is not assigned to this project")
        
    project.teamId = None
    db.add(project)
    db.commit()
    return {"status": "SUCCESS", "message": "Team unassigned from project"}

@router.get("/projects/{projectId}/teams")
def get_project_teams(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get teams assigned to the project
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if not project.teamId:
        return []
    team = db.get(Team, project.teamId)
    return [team] if team else []

# --- SRS ENDPOINTS ---

@router.post("/projects/{projectId}/srs")
def submit_srs(
    projectId: str,
    request: SRSSubmitRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Submit SRS documentation. Typically executed by Team Leader.
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Check if user is leader of the assigned team
    if current_user.role != "admin":
        if not project.teamId:
            raise HTTPException(status_code=403, detail="No team assigned to this project yet")
        team = db.get(Team, project.teamId)
        if team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Only the Team Leader can submit the SRS")

    srs = db.exec(select(SRS).where(SRS.project_id == projectId)).first()
    if not srs:
        srs = SRS(
            project_id=projectId,
            content=request.content,
            status="PENDING",
            submitted_by=current_user.id
        )
    else:
        srs.content = request.content
        srs.status = "PENDING"
        srs.submitted_by = current_user.id
        srs.remarks = None
        srs.timestamp = datetime.utcnow()
        
    db.add(srs)
    db.commit()
    db.refresh(srs)
    return {"status": "SUCCESS", "message": "SRS submitted successfully", "srs": srs}

@router.get("/projects/{projectId}/srs")
def get_srs(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get SRS document status & content
    """
    srs = db.exec(select(SRS).where(SRS.project_id == projectId)).first()
    if not srs:
        raise HTTPException(status_code=404, detail="SRS not found for this project")
    return srs

@router.post("/mentor/projects/{projectId}/srs/approve")
def approve_srs(
    projectId: str,
    request: Optional[SRSReviewRequest] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Approve project SRS document (Mentor or Admin only)
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Mentors or Admins can review SRS documents")
        
    srs = db.exec(select(SRS).where(SRS.project_id == projectId)).first()
    if not srs:
        raise HTTPException(status_code=404, detail="SRS not found")
        
    srs.status = "APPROVED"
    if request:
        srs.remarks = request.remarks
        
    # Also update project status to LIVE
    project = db.get(Project, projectId)
    if project:
        project.status = "LIVE"
        db.add(project)

    db.add(srs)
    db.commit()
    return {"status": "SUCCESS", "message": "SRS approved and project status set to LIVE"}

@router.post("/mentor/projects/{projectId}/srs/reject")
def reject_srs(
    projectId: str,
    request: SRSReviewRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Reject project SRS document with feedback (Mentor or Admin only)
    """
    if current_user.role != "mentor" and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only Mentors or Admins can review SRS documents")
        
    srs = db.exec(select(SRS).where(SRS.project_id == projectId)).first()
    if not srs:
        raise HTTPException(status_code=404, detail="SRS not found")
        
    srs.status = "REJECTED"
    srs.remarks = request.remarks
    db.add(srs)
    db.commit()
    return {"status": "SUCCESS", "message": "SRS rejected with feedback remarks"}

# --- PROJECT MODULE ENDPOINTS ---

@router.post("/projects/{projectId}/modules")
def create_module(
    projectId: str,
    module_in: ModuleCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a project module (Admin / Team Leader)
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Permission verification
    if current_user.role != "admin":
        team = db.get(Team, project.teamId) if project.teamId else None
        if not team or team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Only admin or team leader can create modules")
            
    existing = db.get(Module, module_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Module ID already exists")

    module = Module(
        id=module_in.id,
        project_id=projectId,
        name=module_in.name,
        description=module_in.description
    )
    db.add(module)
    db.commit()
    db.refresh(module)
    return {"status": "SUCCESS", "module": module}

@router.get("/projects/{projectId}/modules")
def get_project_modules(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get all module breakdowns for a project
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    statement = select(Module).where(Module.project_id == projectId)
    return db.exec(statement).all()

@router.patch("/modules/{moduleId}")
def update_module(
    moduleId: str,
    update: ModuleUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update module details (Admin / Team Leader)
    """
    module = db.get(Module, moduleId)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
        
    # Permission verification
    if current_user.role != "admin":
        project = db.get(Project, module.project_id)
        team = db.get(Team, project.teamId) if project.teamId else None
        if not team or team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to edit this module")
            
    data = update.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(module, key, val)
        
    db.add(module)
    db.commit()
    db.refresh(module)
    return {"status": "SUCCESS", "module": module}

@router.delete("/modules/{moduleId}")
def delete_module(
    moduleId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete a module (Admin / Team Leader)
    """
    module = db.get(Module, moduleId)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
        
    # Permission verification
    if current_user.role != "admin":
        project = db.get(Project, module.project_id)
        team = db.get(Team, project.teamId) if project.teamId else None
        if not team or team.leaderId != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this module")
            
    db.delete(module)
    db.commit()
    return {"status": "SUCCESS", "message": "Module deleted"}

class ProjectLinksUpdate(BaseModel):
    gitHubRepo: Optional[str] = None
    liveUrl: Optional[str] = None
    documentationUrl: Optional[str] = None

@router.patch("/projects/{projectId}/links")
def update_project_links(
    projectId: str,
    links_in: ProjectLinksUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update project integration links
    """
    project = db.get(Project, projectId)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if links_in.gitHubRepo is not None:
        project.gitHubRepo = links_in.gitHubRepo
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"status": "SUCCESS", "project": project}

@router.post("/projects/{projectId}/srs/document")
def upload_srs_document(
    projectId: str,
    file_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Link a file artifact as the SRS document
    """
    srs = db.exec(select(ProjectSRS).where(ProjectSRS.project_id == projectId)).first()
    if not srs:
        srs = ProjectSRS(
            id=f"SRS-{int(datetime.utcnow().timestamp())}",
            project_id=projectId,
            version=1,
            file_id=file_id,
            submitted_by=current_user.id
        )
    else:
        srs.file_id = file_id
        srs.version += 1
    db.add(srs)
    db.commit()
    db.refresh(srs)
    return {"status": "SUCCESS", "srs": srs}

@router.get("/projects/{projectId}/srs/document")
def get_srs_document(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get linked SRS document file metadata
    """
    srs = db.exec(select(ProjectSRS).where(ProjectSRS.project_id == projectId)).first()
    if not srs or not srs.file_id:
        raise HTTPException(status_code=404, detail="SRS document not found")
    return {"file_id": srs.file_id}

@router.delete("/projects/{projectId}/srs/document")
def delete_srs_document(
    projectId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete/unlink SRS document file
    """
    srs = db.exec(select(ProjectSRS).where(ProjectSRS.project_id == projectId)).first()
    if not srs:
        raise HTTPException(status_code=404, detail="SRS not found")
    srs.file_id = ""
    db.add(srs)
    db.commit()
    return {"status": "SUCCESS", "message": "SRS document link removed"}
