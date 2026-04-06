from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, or_
from ....api import deps
from ....models.models import Announcement, User, Member, TeamMemberLink, AnnouncementTeamLink
from ....schemas.announcement import AnnouncementCreate, AnnouncementOut

router = APIRouter()

@router.get("/", response_model=List[AnnouncementOut])
def read_announcements(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve tactical broadcasts.
    Global announcements OR those targeted at the user's teams.
    """
    if current_user.role == "admin":
        return db.exec(select(Announcement).offset(skip).limit(limit)).all()

    # Find teams for the current user (using their ID which matches Member.id)
    user_teams_ids = db.exec(
        select(TeamMemberLink.team_id).where(TeamMemberLink.member_id == current_user.id)
    ).all()

    # Query: Global OR Targeted at one of user's teams
    statement = select(Announcement).where(
        or_(
            Announcement.is_global == True,
            Announcement.id.in_(
                select(AnnouncementTeamLink.announcement_id).where(
                    AnnouncementTeamLink.team_id.in_(user_teams_ids)
                )
            )
        )
    ).distinct()
    
    announcements = db.exec(statement.offset(skip).limit(limit)).all()
    return announcements

@router.post("/", response_model=AnnouncementOut)
def broadcast_intel(
    *,
    db: Session = Depends(deps.get_db),
    announcement_in: AnnouncementCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Broadcast tactical intel (Admin only).
    """
    team_ids = announcement_in.team_ids or []
    is_global = announcement_in.is_global if not team_ids else False
    
    announcement = Announcement(
        title=announcement_in.title,
        body=announcement_in.body,
        priority=announcement_in.priority,
        is_global=is_global
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)

    # Link targeted teams
    if team_ids:
        for tid in team_ids:
            link = AnnouncementTeamLink(announcement_id=announcement.id, team_id=tid)
            db.add(link)
        db.commit()
        db.refresh(announcement)

    return announcement

@router.delete("/{id}")
def delete_broadcast(
    id: int,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Remove broadcast from uplink (Admin only).
    """
    announcement = db.get(Announcement, id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(announcement)
    db.commit()
    return {"status": "BROADCAST_REMOVED"}
