from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Any, List

from ...api import deps
from ...models.models import Notification, User

router = APIRouter()

@router.get("/")
def get_my_notifications(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve notification alerts for the currently logged-in user
    """
    statement = select(Notification).where(Notification.user_id == current_user.id).order_by(Notification.timestamp.desc())
    return db.exec(statement).all()

@router.patch("/{id}/read")
def mark_read(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Mark an alert notice as read
    """
    notification = db.get(Notification, id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to read this notification")
        
    notification.is_read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return {"status": "SUCCESS", "notification": notification}
