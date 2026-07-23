from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select, or_
from typing import Any, List, Optional
from datetime import datetime

from ...api import deps
from ...models.models import Notice, User, TeamMemberLink, Member

router = APIRouter()

class NoticeCreate(BaseModel):
    title: str
    body: str
    priority: Optional[str] = "Normal" # Normal, Important, Urgent
    scope: Optional[str] = "GLOBAL" # GLOBAL, TEAM, MENTOR
    target_ids: Optional[List[str]] = [] # Team IDs or Mentor User IDs

class ReactRequest(BaseModel):
    reaction_type: str # e.g. "like", "check", "fire"

class ReplyRequest(BaseModel):
    message: str

@router.post("/admin/notices", status_code=status.HTTP_201_CREATED)
def create_notice(
    notice_in: NoticeCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create a new notice/announcement (Admin only)
    """
    notice = Notice(
        title=notice_in.title,
        description=notice_in.body,
        category=notice_in.priority or "General",
        audience_type=notice_in.scope.upper() if notice_in.scope else "ALL_USERS",
        target_team_ids=notice_in.target_ids or [],
        published_by=current_admin.id
    )
    db.add(notice)
    db.commit()
    db.refresh(notice)
    return {"status": "SUCCESS", "notice": notice}

@router.get("/notices")
def get_notices(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get notices filtered based on the current user's role and team mappings
    """
    if current_user.role == "admin":
        return db.exec(select(Notice)).all()
        
    # Get all global notices
    global_statement = select(Notice).where(Notice.audience_type == "ALL_USERS")
    notices = db.exec(global_statement).all()
    
    if current_user.role == "mentor":
        # Get mentor targeted notices where current_user.id is in target_team_ids
        mentor_notices = db.exec(select(Notice).where(Notice.audience_type == "ALL_MENTORS")).all()
        for n in mentor_notices:
            notices.append(n)
                
    elif current_user.role == "developer":
        # Get team targeted notices where developer's team is in target_team_ids
        member = db.get(Member, current_user.id)
        if member:
            team_links = db.exec(select(TeamMemberLink).where(TeamMemberLink.user_id == current_user.id)).all()
            team_ids = [link.team_id for link in team_links]
            if team_ids:
                team_notices = db.exec(select(Notice).where(Notice.audience_type == "SPECIFIC_TEAMS")).all()
                for n in team_notices:
                    # Check overlap
                    if any(tid in (n.target_team_ids or []) for tid in team_ids):
                        notices.append(n)
                        
    # Remove duplicates and sort by created_at descending
    unique_notices = list({n.id: n for n in notices}.values())
    unique_notices.sort(key=lambda x: x.created_at, reverse=True)
    return unique_notices

@router.get("/notices/{noticeId}")
def notice_details(
    noticeId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get notice details by ID
    """
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    return notice

@router.delete("/admin/notices/{noticeId}")
def delete_notice(
    noticeId: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Delete notice (Admin only)
    """
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
    db.delete(notice)
    db.commit()
    return {"status": "SUCCESS", "message": "Notice deleted"}

# --- NOTICE INTERACTIONS ---

@router.post("/notices/{noticeId}/react")
def react_to_notice(
    noticeId: str,
    request: ReactRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    React to a notice
    """
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    # Record as interaction
    from ...models.models import Interaction
    existing = db.exec(select(Interaction).where(
        Interaction.user_id == current_user.id,
        Interaction.entity_type == "notice",
        Interaction.entity_id == str(noticeId),
        Interaction.interaction_type == "reaction"
    )).first()
    if existing:
        existing.content = request.reaction_type
        db.add(existing)
    else:
        new_interaction = Interaction(
            id=str(__import__('uuid').uuid4()),
            user_id=current_user.id,
            entity_type="notice",
            entity_id=str(noticeId),
            interaction_type="reaction",
            content=request.reaction_type
        )
        db.add(new_interaction)
        
    db.commit()
    return {"status": "SUCCESS", "message": "Reaction recorded"}

@router.post("/notices/{noticeId}/reply")
def reply_to_notice(
    noticeId: str,
    request: ReplyRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Reply / Comment on a notice
    """
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    from ...models.models import Interaction
    import uuid as uuid_mod
    reply = Interaction(
        id=str(uuid_mod.uuid4()),
        user_id=current_user.id,
        entity_type="notice",
        entity_id=str(noticeId),
        interaction_type="comment",
        content=request.message
    )
    db.add(reply)
    db.commit()
    return {"status": "SUCCESS", "message": "Reply recorded", "reply": reply}

@router.post("/notices/{noticeId}/acknowledge")
def acknowledge_notice(
    noticeId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Acknowledge notice receipt
    """
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    from ...models.models import Interaction
    existing = db.exec(select(Interaction).where(
        Interaction.user_id == current_user.id,
        Interaction.entity_type == "notice",
        Interaction.entity_id == str(noticeId),
        Interaction.interaction_type == "note"
    )).first()
    if existing:
        return {"status": "SUCCESS", "message": "Already acknowledged"}
        
    import uuid as uuid_mod
    ack = Interaction(
        id=str(uuid_mod.uuid4()),
        user_id=current_user.id,
        entity_type="notice",
        entity_id=str(noticeId),
        interaction_type="note",
        content="acknowledged"
    )
    db.add(ack)
    db.commit()
    return {"status": "SUCCESS", "message": "Notice acknowledged"}

@router.get("/notices/{noticeId}/responses")
def view_responses(
    noticeId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    View notice reaction, reply, and acknowledgment statistics (Admin / Mentor only)
    """
    if current_user.role != "admin" and current_user.role != "mentor":
        raise HTTPException(status_code=403, detail="Not authorized to view response analytics")
        
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    from ...models.models import Interaction
    reactions = db.exec(select(Interaction).where(
        Interaction.entity_type == "notice",
        Interaction.entity_id == str(noticeId),
        Interaction.interaction_type == "reaction"
    )).all()
    replies = db.exec(select(Interaction).where(
        Interaction.entity_type == "notice",
        Interaction.entity_id == str(noticeId),
        Interaction.interaction_type == "comment"
    )).all()
    acks = db.exec(select(Interaction).where(
        Interaction.entity_type == "notice",
        Interaction.entity_id == str(noticeId),
        Interaction.interaction_type == "note"
    )).all()
    
    return {
        "reactions": [{"user_id": r.user_id, "type": r.content} for r in reactions],
        "replies": [{"user_id": rp.user_id, "message": rp.content, "timestamp": rp.created_at} for rp in replies],
        "acknowledgments": [{"user_id": a.user_id, "timestamp": a.created_at} for a in acks]
    }
