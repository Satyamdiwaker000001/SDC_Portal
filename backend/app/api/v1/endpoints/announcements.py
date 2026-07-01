from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from ....api import deps
from ....models.models import Announcement, User
import uuid

router = APIRouter()

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    audience_type: Optional[str] = "GLOBAL"

class AnnouncementOut(BaseModel):
    id: str
    title: str
    content: str
    audience_type: str
    created_by: str

@router.get("/", response_model=List[AnnouncementOut])
def read_announcements(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
) -> Any:
    return db.exec(select(Announcement).offset(skip).limit(limit)).all()

@router.post("/", response_model=AnnouncementOut, status_code=status.HTTP_201_CREATED)
def broadcast_intel(
    *,
    db: Session = Depends(deps.get_db),
    announcement_in: AnnouncementCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    announcement = Announcement(
        id=str(uuid.uuid4()),
        title=announcement_in.title,
        content=announcement_in.content,
        audience_type=announcement_in.audience_type,
        created_by=current_admin.id
    )
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement

@router.delete("/{id}")
def delete_broadcast(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    announcement = db.get(Announcement, id)
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")
    db.delete(announcement)
    db.commit()
    return {"status": "SUCCESS", "message": "Announcement deleted"}
