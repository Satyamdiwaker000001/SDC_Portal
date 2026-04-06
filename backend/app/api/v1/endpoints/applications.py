from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from ....api import deps
from ....models.models import Application, User
from ....schemas.application import ApplicationCreate, ApplicationOut

router = APIRouter()

@router.post("/", status_code=status.HTTP_201_CREATED)
def submit_enrollment(
    *,
    db: Session = Depends(deps.get_db),
    application_in: ApplicationCreate,
) -> Any:
    """
    Public recruitment enrollment.
    """
    application = Application(
        name=application_in.name,
        email=application_in.email,
        contact=application_in.contact,
        class_name=application_in.class_name,
        interested=application_in.interested
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return {"status": "ENROLLMENT_RECEIVED", "id": application.id}

@router.get("/", response_model=List[ApplicationOut])
def read_aspirants(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Retrieve aspirant registry (Admin only).
    """
    applicants = db.exec(select(Application).offset(skip).limit(limit)).all()
    return applicants
