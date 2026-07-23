from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.responses import Response
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
import os
import shutil
from datetime import datetime, date

from ....api import deps
from ....models.models import Project, User, ProjectPhase, ProjectDocument, TeamMember, File as DBFile, AuditLog, Notification
from ....core.config import settings

router = APIRouter()


def _create_notification_if_missing(
    db: Session,
    *,
    user_id: str,
    title: str,
    message: str,
    event_type: Optional[str] = None,
    related_entity_type: Optional[str] = None,
    related_entity_id: Optional[str] = None,
) -> None:
    existing = db.exec(
        select(Notification)
        .where(Notification.user_id == user_id)
        .where(Notification.title == title)
        .where(Notification.message == message)
    ).first()
    if existing:
        return

    db.add(Notification(
        id=str(uuid.uuid4()),
        user_id=user_id,
        title=title,
        message=message,
        event_type=event_type or "SYSTEM",
        related_entity_type=related_entity_type,
        related_entity_id=related_entity_id,
    ))

class ProjectCreate(BaseModel):
    name: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    type: Optional[str] = "Web_App"
    deadline: Optional[date] = None
    academic_year: Optional[str] = "2025-26"
    team_id: Optional[str] = None
    github_repo: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None

class ProjectOut(BaseModel):
    id: str
    name: str
    short_description: Optional[str]
    full_description: Optional[str]
    status: str
    type: str
    deadline: Optional[date]
    academic_year: str
    team_id: Optional[str]
    github_repo: Optional[str]
    live_url: Optional[str]
    image_url: Optional[str]
    is_featured: bool
    progress: int
    created_at: datetime

class PhaseOut(BaseModel):
    id: str
    project_id: str
    name: str
    sequence: int
    is_unlocked: bool
    is_completed: bool
    progress: int
    updated_at: datetime

class DocumentOut(BaseModel):
    id: str
    project_id: str
    document_type: str
    file_id: Optional[str]
    uploaded_at: datetime
    updated_at: datetime
    file_url: Optional[str] = None
    file_name: Optional[str] = None

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProjectOut)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    if current_user.role not in ("admin", "developer"):
        raise HTTPException(status_code=403, detail="Only Admins or Developers are permitted to initialize projects")
        
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
        created_by=current_user.id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Predefine the 7 SDLC Phases automatically
    phases = ["Planning", "Analysis", "Design", "Development", "Testing", "Deployment", "Maintenance"]
    for idx, phase_name in enumerate(phases):
        p_phase = ProjectPhase(
            id=str(uuid.uuid4()),
            project_id=project.id,
            name=phase_name,
            sequence=idx + 1,
            is_unlocked=(idx == 0), # Planning phase is unlocked by default
            is_completed=False,
            progress=0,
            updated_at=datetime.utcnow()
        )
        db.add(p_phase)
        
    # Predefine the 16 SE Documents in documentation repository
    # SRS 3.14 — Exactly 16 mandatory SE document types
    documents = [
        "PRD", "BRD", "SRS", "Use Case Document",
        "Use Case Diagrams", "Workflow Document",
        "DFD", "ERD", "Database Design", "API Documentation",
        "Frontend Documentation", "Backend Documentation",
        "Deployment Guide", "Testing Documentation",
        "User Manual", "Developer Guide"
    ]
    for doc_type in documents:
        p_doc = ProjectDocument(
            id=str(uuid.uuid4()),
            project_id=project.id,
            document_type=doc_type,
            file_id=None,
            uploaded_by=None,
            uploaded_at=None,
            updated_at=datetime.utcnow()
        )
        db.add(p_doc)

        recipients = set()

    # Notify all admins
    admins = db.exec(
        select(User).where(User.role == "admin")
    ).all()

    for admin in admins:
        recipients.add(admin.id)

    # Notify assigned team members only
    if project.team_id:
        team_members = db.exec(
            select(TeamMember).where(TeamMember.team_id == project.team_id)
        ).all()

        for member in team_members:
            recipients.add(member.user_id)

    for user_id in recipients:
        _create_notification_if_missing(
            db,
            user_id=user_id,
            title="New project created",
            message=f"New project created: {project.name}",
            event_type="PROJECT_CREATED",
            related_entity_type="project",
            related_entity_id=project.id,
        )
        
    # Audit log (SRS 3.16)
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="PROJECT_CREATED",
        description=f"Project '{project_in.name}' created.",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="project",
        related_entity_id=project.id,
    ))
    
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
    
    old_status = project.status
    project.status = status.upper()
    db.add(project)
    
    project.updated_at = datetime.utcnow()
    # Audit log (SRS 3.16)
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="PROJECT_CREATED",
        description=f"Project '{project.name}' status: {old_status} → {project.status}",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="project",
        related_entity_id=project.id,
    ))
    
    db.commit()
    db.refresh(project)
    return project

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    type: Optional[str] = None
    deadline: Optional[date] = None
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
    
    # Authorization checks
    is_tl = False
    if project.team_id:
        tl_member = db.exec(
            select(TeamMember)
            .where(TeamMember.team_id == project.team_id)
            .where(TeamMember.user_id == current_user.id)
            .where(TeamMember.designation == "lead")
        ).first()
        is_tl = tl_member is not None
        
    if current_user.role != "admin" and not is_tl:
        raise HTTPException(status_code=403, detail="Only Administrator or Team Leader of the project's team can update project details")

    update_data = project_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "status" and value:
            setattr(project, key, value.upper())
        else:
            setattr(project, key, value)
            
    db.add(project)
    
    project.updated_at = datetime.utcnow()
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="PROJECT_CREATED",
        description=f"Project '{project.name}' updated.",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="project",
        related_entity_id=project.id,
    ))
    
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
        
    try:
        from ....models.models import Task, ProjectPhase, ProjectDocument
        
        # Delete tasks
        tasks = db.exec(select(Task).where(Task.project_id == id)).all()
        for task in tasks:
            db.delete(task)
            
        # Delete phases
        phases = db.exec(select(ProjectPhase).where(ProjectPhase.project_id == id)).all()
        for phase in phases:
            db.delete(phase)
            
        # Delete documents
        docs = db.exec(select(ProjectDocument).where(ProjectDocument.project_id == id)).all()
        for doc in docs:
            db.delete(doc)
            
        db.delete(project)
        
        db.add(AuditLog(
            id=str(uuid.uuid4()),
            event_type="PROJECT_CREATED",
            description=f"Project '{id}' deleted by admin.",
            performed_by=current_admin.id,
            user_role="admin",
            related_module="project",
            related_entity_id=id,
        ))
        
        db.commit()
        return {"status": "SUCCESS", "message": "Project and its components deleted successfully"}
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Failed to delete project: {str(e)}")

# --- SDLC PHASES ENDPOINTS ---

@router.get("/{id}/phases", response_model=List[PhaseOut])
def get_project_phases(
    id: str,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all SDLC phases of a project, ordered by sequence.
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db.exec(select(ProjectPhase).where(ProjectPhase.project_id == id).order_by(ProjectPhase.sequence)).all()

@router.patch("/{id}/phases/{phase_id}/unlock", response_model=PhaseOut)
def manual_unlock_phase(
    id: str,
    phase_id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin)
) -> Any:
    """
    Manually unlock a project phase (Admin only override - FR-058 / BR-007).
    """
    phase = db.get(ProjectPhase, phase_id)
    if not phase or phase.project_id != id:
        raise HTTPException(status_code=404, detail="Phase not found for this project")
    
    phase.is_unlocked = True
    phase.updated_at = datetime.utcnow()
    db.add(phase)
    
    phase.unlocked_at = datetime.utcnow()
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="PHASE_UNLOCKED",
        description=f"Phase '{phase.name}' manually unlocked by admin (parallel dev override).",
        performed_by=current_admin.id,
        user_role="admin",
        related_module="phase",
        related_entity_id=phase_id,
    ))
    
    db.commit()
    db.refresh(phase)
    return phase

# --- DOCUMENT REPOSITORY ENDPOINTS ---

@router.get("/{id}/documents", response_model=List[DocumentOut])
def get_project_documents(
    id: str,
    request: Request,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Get all 16 predefined software engineering documents for the project.
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    docs = db.exec(select(ProjectDocument).where(ProjectDocument.project_id == id)).all()
    
    # Enrich with file urls and names
    base_url = str(request.base_url).rstrip("/")
    enriched_docs = []
    for d in docs:
        d_out = DocumentOut(
            id=d.id,
            project_id=d.project_id,
            document_type=d.document_type,
            file_id=d.file_id,
            uploaded_at=d.uploaded_at,
            updated_at=d.updated_at
        )
        if d.file_id:
            db_file = db.get(DBFile, d.file_id)
            if db_file:
                d_out.file_url = f"{base_url}{settings.API_V1_STR}/projects/documents/{d.file_id}/download"
                d_out.file_name = db_file.original_name
        enriched_docs.append(d_out)
        
    return enriched_docs

@router.post("/{id}/documents/{doc_id}/upload", response_model=DocumentOut)
async def upload_project_document(
    id: str,
    doc_id: str,
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload or replace a project document (Team Leader only - FR-114 / BR-008).
    """
    project = db.get(Project, id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Check if current_user is the Team Leader of the project's assigned team
    if not project.team_id:
        raise HTTPException(status_code=400, detail="No team assigned to this project yet")
        
    tl_member = db.exec(
        select(TeamMember)
        .where(TeamMember.team_id == project.team_id)
        .where(TeamMember.user_id == current_user.id)
        .where(TeamMember.designation == "lead")
    ).first()
    
    if not tl_member and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only the Team Leader of this project can upload documents")

    doc = db.get(ProjectDocument, doc_id)
    if not doc or doc.project_id != id:
        raise HTTPException(status_code=404, detail="Document slot not found")

    file_uuid = str(uuid.uuid4())
    file_content = await file.read()
    
    # Save File record in DB
    db_file = DBFile(
        id=file_uuid,
        original_name=file.filename,
        stored_name=file.filename,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=len(file_content),
        file_data=file_content,
        uploaded_by=current_user.id,
        uploaded_at=datetime.utcnow(),
    )
    db.add(db_file)
    db.commit()
    
    # Update Document Slot record
    doc.file_id = db_file.id
    doc.uploaded_by = current_user.id
    doc.uploaded_at = datetime.utcnow()
    doc.updated_at = datetime.utcnow()
    db.add(doc)

    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="DOCUMENTATION_UPLOAD",
        description=f"Document '{doc.document_type}' uploaded: {file.filename}",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="document",
        related_entity_id=doc.id,
    ))
    
    db.commit()
    db.refresh(doc)
    
    base_url = str(request.base_url).rstrip("/")
    file_url = f"{base_url}{settings.API_V1_STR}/projects/documents/{db_file.id}/download"
    
    d_out = DocumentOut(
        id=doc.id,
        project_id=doc.project_id,
        document_type=doc.document_type,
        file_id=doc.file_id,
        uploaded_at=doc.uploaded_at,
        updated_at=doc.updated_at,
        file_url=file_url,
        file_name=file.filename
    )
    return d_out

@router.get("/documents/{file_id}/download")
def download_document(
    file_id: str,
    db: Session = Depends(deps.get_db)
):
    """
    Download a document directly from the database.
    """
    db_file = db.get(DBFile, file_id)
    if not db_file or not db_file.file_data:
        raise HTTPException(status_code=404, detail="File not found")
        
    return Response(
        content=db_file.file_data,
        media_type=db_file.mime_type,
        headers={"Content-Disposition": f'attachment; filename="{db_file.original_name}"'}
    )
