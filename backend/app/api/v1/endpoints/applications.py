from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
import uuid
from ....api import deps
from ....models.models import Application, User

router = APIRouter()

class ApplicationCreate(BaseModel):
    name: str
    email: str
    branch: str
    admission_year: int
    passout_year: int
    batch_year: str
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = None

class ApplicationOut(BaseModel):
    id: str
    name: str
    email: str
    branch: str
    admission_year: int
    passout_year: int
    batch_year: str
    linkedin_url: Optional[str]
    github_url: Optional[str]
    status: str

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ApplicationOut)
def create_application(
    application_in: ApplicationCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    app_id = str(uuid.uuid4())
    application = Application(
        id=app_id,
        name=application_in.name,
        email=application_in.email,
        branch=application_in.branch,
        admission_year=application_in.admission_year,
        passout_year=application_in.passout_year,
        batch_year=application_in.batch_year,
        linkedin_url=application_in.linkedin_url,
        github_url=application_in.github_url,
        resume_file_id=application_in.resume_file_id,
        status="PENDING"
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application

@router.get("/", response_model=List[ApplicationOut])
def list_applications(
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    return db.exec(select(Application)).all()

@router.get("/{id}", response_model=ApplicationOut)
def get_application(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.patch("/{id}/status", response_model=ApplicationOut)
def update_application_status(
    id: str,
    status_update: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    app.status = status_update.upper()
    db.add(app)
    db.commit()
    db.refresh(app)
    return app
