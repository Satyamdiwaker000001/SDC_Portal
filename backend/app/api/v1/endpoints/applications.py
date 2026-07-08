from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from typing import Any, List, Optional
import uuid
from datetime import datetime

from ....api import deps
from ....models.models import Application, User, AuditLog

router = APIRouter()


# --------------------------------------------------------------------------- #
#  Schemas                                                                     #
# --------------------------------------------------------------------------- #

class ApplicationCreate(BaseModel):
    """SRS 3.4.1 — all mandatory fields for the public recruitment form."""
    name: str
    email: str
    mobile_number: str                                    # SRS 3.4.1 (required)
    branch: str
    admission_year: int
    passout_year: int
    batch_year: str
    current_semester: Optional[str] = None               # SRS 3.4.1
    technical_specialization: Optional[str] = None       # SRS 3.4.1
    additional_information: Optional[str] = None         # SRS 3.4.1 (optional)
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    resume_file_id: Optional[str] = None


class ApplicationOut(BaseModel):
    id: str
    name: str
    email: str
    mobile_number: str
    branch: str
    admission_year: int
    passout_year: int
    batch_year: str
    current_semester: Optional[str]
    technical_specialization: Optional[str]
    additional_information: Optional[str]
    linkedin_url: Optional[str]
    github_url: Optional[str]
    status: str
    generated_user_id: Optional[str] = None
    generated_password: Optional[str] = None
    reviewed_by: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# --------------------------------------------------------------------------- #
#  Endpoints                                                                   #
# --------------------------------------------------------------------------- #

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ApplicationOut)
def create_application(
    application_in: ApplicationCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Public endpoint — submit a recruitment application (FR-034).
    Only available when recruitment is enabled (FR-033).
    """
    from ....models.models import SystemSetting
    setting = db.exec(
        select(SystemSetting).where(SystemSetting.key == "is_recruitment_live")
    ).first()
    if not setting or setting.value.lower() != "true":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruitment is currently closed."
        )

    # BR: One active application per email
    existing = db.exec(
        select(Application)
        .where(Application.email == application_in.email)
        .where(Application.status == "PENDING")
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An active application already exists for this email address."
        )

    application = Application(
        id=str(uuid.uuid4()),
        name=application_in.name,
        email=application_in.email,
        mobile_number=application_in.mobile_number,
        branch=application_in.branch,
        admission_year=application_in.admission_year,
        passout_year=application_in.passout_year,
        batch_year=application_in.batch_year,
        current_semester=application_in.current_semester,
        technical_specialization=application_in.technical_specialization,
        additional_information=application_in.additional_information,
        linkedin_url=application_in.linkedin_url,
        github_url=application_in.github_url,
        resume_file_id=application_in.resume_file_id,
        status="PENDING",
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
    """List all applications (Admin only — FR-035)."""
    return db.exec(select(Application).order_by(Application.created_at.desc())).all()


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
    """
    Approve or reject an application (Admin only — FR-036).
    On approval: auto-creates Developer account (FR-037, FR-038, FR-039, FR-041).
    """
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    new_status = status_update.upper()
    if new_status not in ["ACCEPTED", "APPROVED", "REJECTED"]:
        raise HTTPException(status_code=400, detail="Invalid status. Use ACCEPTED or REJECTED.")

    # Normalise APPROVED → ACCEPTED
    if new_status == "APPROVED":
        new_status = "ACCEPTED"

    app.status = new_status
    app.reviewed_by = current_admin.id
    app.reviewed_at = datetime.utcnow()

    if new_status == "ACCEPTED" and not app.generated_user_id:
        # --- Auto-provision Developer account (FR-037 – FR-041) ---
        from ....core import security
        from ....models.models import User as DBUser
        import random
        import string

        # FR-038: Generate unique User ID
        user_uuid = str(uuid.uuid4()).split("-")[0].upper()
        name_part = "".join(c for c in app.name if c.isalnum())[:4].upper()
        generated_id = f"USR-{name_part}-{user_uuid}"

        # FR-039: Generate random initial password
        raw_password = "SDC@" + "".join(
            random.choices(string.ascii_uppercase + string.digits, k=6)
        )

        # FR-041: Create Developer user (membership_status = 'active')
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
            membership_status="active",
            is_active=True,
            performance_score=0.0,
        )
        db.add(dev_user)

        app.generated_user_id = generated_id
        app.generated_password = raw_password

        # Audit log (SRS 3.16)
        db.add(AuditLog(
            id=str(uuid.uuid4()),
            event_type="RECRUITMENT_APPROVED",
            description=f"Application for '{app.name}' approved. Developer account {generated_id} created.",
            performed_by=current_admin.id,
            user_role="admin",
            related_module="application",
            related_entity_id=app.id,
        ))
    elif new_status == "REJECTED":
        db.add(AuditLog(
            id=str(uuid.uuid4()),
            event_type="RECRUITMENT_APPROVED",
            description=f"Application for '{app.name}' rejected by admin.",
            performed_by=current_admin.id,
            user_role="admin",
            related_module="application",
            related_entity_id=app.id,
        ))

    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.delete("/{id}")
def delete_application(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Delete an application (Admin only)."""
    app = db.get(Application, id)
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()
    return {"status": "SUCCESS", "message": "Application deleted successfully"}
