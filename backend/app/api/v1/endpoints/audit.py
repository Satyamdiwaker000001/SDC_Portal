from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import Any, List
from ....api import deps
from ....models.models import ActivityLog, User

router = APIRouter()

@router.get("/logs")
def get_audit_logs(
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Get all audit logs (Admin only).
    """
    statement = select(ActivityLog).order_by(ActivityLog.created_at.desc())
    logs = db.exec(statement).all()
    
    enriched_logs = []
    for log in logs:
        user_name = "System"
        user_role = "system"
        if log.user_id != "SYSTEM":
            user = db.get(User, log.user_id)
            if user:
                user_name = user.name
                user_role = user.role
                
        enriched_logs.append({
            "id": log.id,
            "user_id": log.user_id,
            "user_name": user_name,
            "user_role": user_role,
            "entity_type": log.entity_type,
            "entity_id": log.entity_id,
            "action": log.action,
            "is_audit": log.is_audit,
            "created_at": log.created_at
        })
    return enriched_logs
