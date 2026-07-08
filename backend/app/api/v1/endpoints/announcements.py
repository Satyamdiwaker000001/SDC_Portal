from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import datetime
import uuid

from ....api import deps
from ....models.models import Announcement, User, AuditLog

router = APIRouter()


# --------------------------------------------------------------------------- #
#  Schemas                                                                     #
# --------------------------------------------------------------------------- #

class AnnouncementCreate(BaseModel):
    """SRS 3.13.2 — Announcement fields. Published by Admin or Mentor."""
    title: str
    content: str
    audience_type: Optional[str] = "ALL_USERS"   # ALL_USERS | ALL_DEVELOPERS | ALL_MENTORS | SPECIFIC_TEAMS | ALL_TEAMS | INDIVIDUAL_DEVELOPERS | INDIVIDUAL_MENTORS | PROJECT_MEMBERS
    target_team_ids: Optional[List[str]] = []
    attachment_file_id: Optional[str] = None


class AnnouncementOut(BaseModel):
    id: str
    title: str
    content: str
    audience_type: str
    target_team_ids: List[str]
    attachment_file_id: Optional[str]
    published_by: str
    created_at: datetime

    class Config:
        from_attributes = True


# --------------------------------------------------------------------------- #
#  Endpoints                                                                   #
# --------------------------------------------------------------------------- #

@router.get("/", response_model=List[AnnouncementOut])
def list_announcements(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    """Retrieve announcements — available to all authenticated users (FR-102)."""
    return db.exec(
        select(Announcement).order_by(Announcement.created_at.desc())
        .offset(skip).limit(limit)
    ).all()


@router.post("/", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def create_announcement(
    *,
    db: Session = Depends(deps.get_db),
    announcement_in: AnnouncementCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Publish an announcement (Admin or Mentor — FR-101, FR-103).
    Mentor can only target their assigned teams (SRS BR 3.13.2).
    """
    if current_user.role not in ["admin", "mentor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admin and Mentor can publish announcements."
        )

    # Business Rule (SRS 3.13.2): Mentor can only target assigned teams
    if current_user.role == "mentor":
        from ....models.models import TeamMember
        mentor_teams = db.exec(
            select(TeamMember)
            .where(TeamMember.user_id == current_user.id)
            .where(TeamMember.designation == "mentor")
        ).all()
        allowed_team_ids = {tm.team_id for tm in mentor_teams}

        # Force mentor to target only their teams
        target_ids = announcement_in.target_team_ids or []
        if target_ids:
            invalid = [t for t in target_ids if t not in allowed_team_ids]
            if invalid:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Mentors can only target their own assigned teams."
                )
        # If mentor sends ALL_USERS etc., restrict to their teams
        if announcement_in.audience_type not in ["SPECIFIC_TEAMS", "ALL_TEAMS"]:
            if current_user.role == "mentor":
                announcement_in.audience_type = "SPECIFIC_TEAMS"
                announcement_in.target_team_ids = list(allowed_team_ids)

    announcement = Announcement(
        id=str(uuid.uuid4()),
        title=announcement_in.title,
        content=announcement_in.content,
        audience_type=announcement_in.audience_type or "ALL_USERS",
        target_team_ids=announcement_in.target_team_ids or [],
        attachment_file_id=announcement_in.attachment_file_id,
        published_by=current_user.id,
    )
    db.add(announcement)

    # Audit log (SRS 3.16)
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        event_type="ANNOUNCEMENT_PUBLISHED",
        description=f"Announcement '{announcement_in.title}' published. Audience: {announcement_in.audience_type}",
        performed_by=current_user.id,
        user_role=current_user.role,
        related_module="announcement",
        related_entity_id=announcement.id,
    ))

    db.commit()
    db.refresh(announcement)
    return announcement


@router.delete("/{id}")
def delete_announcement(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """Delete an announcement (Admin only)."""
    announcement = db.get(Announcement, id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(announcement)
    db.commit()
    return {"status": "SUCCESS", "message": "Announcement deleted successfully"}
