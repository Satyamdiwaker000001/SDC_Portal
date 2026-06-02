from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
from datetime import datetime, date
import uuid

from ...api import deps
from ...models.models import RecruitmentDrive, Application, ApplicationNote, User, File

router = APIRouter()

class DriveCreate(BaseModel):
    title: str
    start_date: date
    end_date: date
    status: Optional[str] = "UPCOMING"

class DriveUpdate(BaseModel):
    title: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None

class ApplicationSubmit(BaseModel):
    name: str
    email: str
    branch: str
    admission_year: int
    passout_year: int
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationNoteCreate(BaseModel):
    note: str

@router.post("/recruitment-drives", status_code=status.HTTP_201_CREATED)
def create_drive(
    drive_in: DriveCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    drive = RecruitmentDrive(
        id=str(uuid.uuid4()),
        title=drive_in.title,
        start_date=drive_in.start_date,
        end_date=drive_in.end_date,
        status=drive_in.status
    )
    db.add(drive)
    db.commit()
    db.refresh(drive)
    return drive

@router.get("/recruitment-drives", response_model=List[RecruitmentDrive])
def list_drives(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    return db.exec(select(RecruitmentDrive)).all()

@router.get("/recruitment-drives/{id}", response_model=RecruitmentDrive)
def get_drive(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    drive = db.get(RecruitmentDrive, id)
    if not drive:
        raise HTTPException(status_code=404, detail="Recruitment drive not found")
    return drive

@router.patch("/recruitment-drives/{id}", response_model=RecruitmentDrive)
def update_drive(
    id: str,
    update: DriveUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    drive = db.get(RecruitmentDrive, id)
    if not drive:
        raise HTTPException(status_code=404, detail="Recruitment drive not found")
    data = update.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(drive, key, val)
    db.add(drive)
    db.commit()
    db.refresh(drive)
    return drive

@router.delete("/recruitment-drives/{id}")
def delete_drive(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    drive = db.get(RecruitmentDrive, id)
    if not drive:
        raise HTTPException(status_code=404, detail="Recruitment drive not found")
    db.delete(drive)
    db.commit()
    return {"status": "SUCCESS", "message": "Recruitment drive deleted"}

@router.post("/recruitment-drives/{id}/apply", status_code=status.HTTP_201_CREATED)
def apply_to_drive(
    id: str,
    application_in: ApplicationSubmit,
    db: Session = Depends(deps.get_db),
) -> Any:
    drive = db.get(RecruitmentDrive, id)
    if not drive:
        raise HTTPException(status_code=404, detail="Recruitment drive not found")
    
    app_id = str(uuid.uuid4())
    app = Application(
        id=app_id,
        drive_id=id,
        name=application_in.name,
        email=application_in.email,
        branch=application_in.branch,
        admission_year=application_in.admission_year,
        passout_year=application_in.passout_year,
        linkedin_url=application_in.linkedin_url,
        github_url=application_in.github_url,
        resume_file_id=application_in.resume_file_id,
        status="PENDING"
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.get("/applications", response_model=List[Application])
def list_applications(
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    return db.exec(select(Application)).all()

@router.get("/applications/{id}", response_model=Application)
def get_application(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.patch("/applications/{id}/status", response_model=Application)
def update_application_status(
    id: str,
    status_update: ApplicationStatusUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = status_update.status.upper()
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

@router.post("/applications/{id}/notes", status_code=status.HTTP_201_CREATED)
def create_application_note(
    id: str,
    note_in: ApplicationNoteCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    note = ApplicationNote(
        id=str(uuid.uuid4()),
        application_id=id,
        admin_id=current_admin.id,
        note=note_in.note
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/applications/{id}/notes", response_model=List[ApplicationNote])
def list_application_notes(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    return db.exec(select(ApplicationNote).where(ApplicationNote.application_id == id)).all()

@router.patch("/notes/{noteId}", response_model=ApplicationNote)
def update_application_note(
    noteId: str,
    note_in: ApplicationNoteCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    note = db.get(ApplicationNote, noteId)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note.note = note_in.note
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.get("/applications/{applicationId}/resume")
def get_application_resume(
    applicationId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    app = db.get(Application, applicationId)
    if not app or not app.resume_file_id:
        raise HTTPException(status_code=404, detail="Resume not found for application")
    file = db.get(File, app.resume_file_id)
    if not file:
        raise HTTPException(status_code=404, detail="Resume file metadata not found")
    return {"file_id": file.id, "original_name": file.original_name}
