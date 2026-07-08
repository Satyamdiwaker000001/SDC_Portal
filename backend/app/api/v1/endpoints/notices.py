from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import datetime
import uuid

from ....api import deps
from ....models.models import Notice, User, AuditLog

router = APIRouter()


# --------------------------------------------------------------------------- #
#  Schemas                                                                     #
# --------------------------------------------------------------------------- #

class NoticeCreate(BaseModel):
    """SRS 3.13.1 — Notice fields for Admin-only official notices."""
    title: str
    description: str
    category: Optional[str] = "General"
    audience_type: Optional[str] = "ALL_USERS"   # ALL_USERS | ALL_DEVELOPERS | ALL_MENTORS | SPECIFIC_TEAMS | ALL_TEAMS | INDIVIDUAL_USERS
    target_team_ids: Optional[List[str]] = []
    expiry_date: Optional[datetime] = None        # SRS 3.13.1: optional
    attachment_file_id: Optional[str] = None      # SRS 3.13.1: optional
    is_pinned: Optional[bool] = False


class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    audience_type: Optional[str] = None
    target_team_ids: Optional[List[str]] = None
    expiry_date: Optional[datetime] = None
    is_pinned: Optional[bool] = None


class NoticeOut(BaseModel):
    id: str
    title: str
    description: str
    category: str
    audience_type: str
    target_team_ids: List[str]
    expiry_date: Optional[datetime]
    attachment_file_id: Optional[str]
    published_by: str
    is_pinned: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# --------------------------------------------------------------------------- #
#  Endpoints                                                                   #
# --------------------------------------------------------------------------- #

@router.get("/", response_model=List[NoticeOut])
def list_notices(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """Retrieve notices — available to all authenticated users (FR-097)."""
    return db.exec(
        select(Notice).order_by(Notice.is_pinned.desc(), Notice.created_at.desc())
        .offset(skip).limit(limit)
    ).all()


@router.post("/", response_model=NoticeOut, status_code=status.HTTP_201_CREATED)
def create_notice(
    *,
    db: Session = Depends(deps.get_db),
    notice_in: NoticeCreate,
    current_admin: User = Depends(deps.get_current_active_admin),   # Admin only (SRS 3.13.1)
) -> Any:
    """
    Publish an official notice (Admin only — FR-096, FR-098).
    """
    notice = Notice(
        id=str(uuid.uuid4()),
        title=notice_in.title,
        description=notice_in.description,
        category=notice_in.category or "General",
        audience_type=notice_in.audience_type or "ALL_USERS",
        target_team_ids=notice_in.target_team_ids or [],
        expiry_date=notice_in.expiry_date,
        attachment_file_id=notice_in.attachment_file_id,
        published_by=current_admin.id,
        is_pinned=notice_in.is_pinned or False,
    )
    db.add(notice)

    # Audit log (SRS 3.16)
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="NOTICE_PUBLISHED",
        description=f"Notice '{notice_in.title}' published. Audience: {notice_in.audience_type}",
        performed_by=current_admin.id,
        user_role="admin",
        related_module="notice",
        related_entity_id=notice.id,
    ))

    db.commit()
    db.refresh(notice)
    return notice


@router.get("/{id}", response_model=NoticeOut)
def get_notice(
    id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    notice = db.get(Notice, id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice


@router.patch("/{id}", response_model=NoticeOut)
def update_notice(
    id: str,
    notice_in: NoticeUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Update an existing notice (Admin only — FR-099)."""
    notice = db.get(Notice, id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")

    update_data = notice_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(notice, field, value)
    notice.updated_at = datetime.utcnow()

    db.add(notice)
    db.commit()
    db.refresh(notice)
    return notice


@router.delete("/{id}")
def delete_notice(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Delete a notice (Admin only — FR-100)."""
    notice = db.get(Notice, id)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")

    db.delete(notice)
    db.commit()
    return {"status": "SUCCESS", "message": "Notice deleted successfully"}
