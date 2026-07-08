from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
import uuid
from datetime import datetime
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
    generated_user_id: Optional[str] = None
    generated_password: Optional[str] = None

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
        
    new_status = status_update.upper()
    app.status = new_status
    
    if new_status in ["ACCEPTED", "APPROVED"] and not app.generated_user_id:
        # Auto-provision Developer account
        from ....core import security
        from ....models.models import User as DBUser, ActivityLog
        import random
        import string
        
        # 1. Generate unique User ID
        user_uuid = str(uuid.uuid4()).split("-")[0].upper()
        name_part = "".join(c for c in app.name if c.isalnum())[:4].upper()
        generated_id = f"USR-{name_part}-{user_uuid}"
        
        # 2. Generate random initial password
        raw_password = "SDC@" + "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        
        # 3. Create developer user
        dev_user = DBUser(
            id=generated_id,
            name=app.name,
            email=app.email,
            password_hash=security.get_password_hash(raw_password),
            role="developer",
            branch=app.branch,
            admission_year=app.admission_year,
            passout_year=app.passout_year,
            linkedin_url=app.linkedin_url,
            github_url=app.github_url,
            is_active=True,
            is_retired=False,
            performance_score=0.0
        )
        db.add(dev_user)
        
        # Store credentials on the application record
        app.generated_user_id = generated_id
        app.generated_password = raw_password
        
        # 4. Log in Audit
        audit = ActivityLog(
            id=str(uuid.uuid4()),
            user_id=current_admin.id,
            entity_type="application",
            entity_id=app.id,
            action=f"RECRUITMENT_APPROVE: Created user {generated_id} with email {app.email}",
            is_audit=True,
            created_at=datetime.utcnow()
        )
        db.add(audit)
        
    db.add(app)
    db.commit()
    db.refresh(app)
    return app

