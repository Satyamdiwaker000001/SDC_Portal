from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select, or_
from typing import Any, List, Optional
from datetime import datetime

from ...api import deps
from ...models.models import Notice, User, TeamMemberLink, NoticeReaction, NoticeReply, NoticeAcknowledgment, Member

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
        body=notice_in.body,
        priority=notice_in.priority,
        scope=notice_in.scope.upper(),
        target_ids=notice_in.target_ids,
        created_by=current_admin.id
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
    global_statement = select(Notice).where(Notice.scope == "GLOBAL")
    notices = db.exec(global_statement).all()
    
    if current_user.role == "mentor":
        # Get mentor targeted notices where current_user.id is in target_ids
        mentor_notices = db.exec(select(Notice).where(Notice.scope == "MENTOR")).all()
        for n in mentor_notices:
            if current_user.id in n.target_ids:
                notices.append(n)
                
    elif current_user.role == "developer":
        # Get team targeted notices where developer's team is in target_ids
        member = db.get(Member, current_user.id)
        if member:
            team_ids = [t.id for t in member.teams]
            if team_ids:
                team_notices = db.exec(select(Notice).where(Notice.scope == "TEAM")).all()
                for n in team_notices:
                    # Check overlap
                    if any(tid in n.target_ids for tid in team_ids):
                        notices.append(n)
                        
    # Remove duplicates and sort by timestamp descending
    unique_notices = list({n.id: n for n in notices}.values())
    unique_notices.sort(key=lambda x: x.timestamp, reverse=True)
    return unique_notices

@router.get("/notices/{noticeId}")
def notice_details(
    noticeId: int,
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
    noticeId: int,
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
    noticeId: int,
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
        
    # Check if reaction exists
    existing = db.exec(select(NoticeReaction).where(NoticeReaction.notice_id == noticeId, NoticeReaction.user_id == current_user.id)).first()
    if existing:
        existing.reaction_type = request.reaction_type
        db.add(existing)
    else:
        new_reaction = NoticeReaction(
            notice_id=noticeId,
            user_id=current_user.id,
            reaction_type=request.reaction_type
        )
        db.add(new_reaction)
        
    db.commit()
    return {"status": "SUCCESS", "message": "Reaction recorded"}

@router.post("/notices/{noticeId}/reply")
def reply_to_notice(
    noticeId: int,
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
        
    reply = NoticeReply(
        notice_id=noticeId,
        user_id=current_user.id,
        message=request.message
    )
    db.add(reply)
    db.commit()
    return {"status": "SUCCESS", "message": "Reply recorded", "reply": reply}

@router.post("/notices/{noticeId}/acknowledge")
def acknowledge_notice(
    noticeId: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Acknowledge notice receipt
    """
    notice = db.get(Notice, noticeId)
    if not notice:
        raise HTTPException(status_code=404, detail="Notice not found")
        
    existing = db.exec(select(NoticeAcknowledgment).where(NoticeAcknowledgment.notice_id == noticeId, NoticeAcknowledgment.user_id == current_user.id)).first()
    if existing:
        return {"status": "SUCCESS", "message": "Already acknowledged"}
        
    ack = NoticeAcknowledgment(notice_id=noticeId, user_id=current_user.id)
    db.add(ack)
    db.commit()
    return {"status": "SUCCESS", "message": "Notice acknowledged"}

@router.get("/notices/{noticeId}/responses")
def view_responses(
    noticeId: int,
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
        
    reactions = db.exec(select(NoticeReaction).where(NoticeReaction.notice_id == noticeId)).all()
    replies = db.exec(select(NoticeReply).where(NoticeReply.notice_id == noticeId)).all()
    acks = db.exec(select(NoticeAcknowledgment).where(NoticeAcknowledgment.notice_id == noticeId)).all()
    
    return {
        "reactions": [{"user_id": r.user_id, "type": r.reaction_type} for r in reactions],
        "replies": [{"user_id": rp.user_id, "message": rp.message, "timestamp": rp.timestamp} for rp in replies],
        "acknowledgments": [{"user_id": a.user_id, "timestamp": a.timestamp} for a in acks]
    }
