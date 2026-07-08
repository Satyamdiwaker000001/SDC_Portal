from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from typing import Any, List, Optional
from ....api import deps
from ....models.models import AuditLog, User

router = APIRouter()


@router.get("/logs")
def get_audit_logs(
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
    limit: int = 200,
) -> Any:
    """
    Get all audit logs (Admin only — SRS 3.16, FR-125–FR-129).
    Returns SRS-defined fields: event_type, description, performed_by,
    user_role, related_module, related_entity_id, remarks, created_at.
    """
    logs = db.exec(
        select(AuditLog)
        .order_by(AuditLog.created_at.desc())
        .limit(limit)
    ).all()

    enriched = []
    for log in logs:
        # Resolve performed_by user name for display
        user_name = "System"
        user_role = log.user_role or "system"
        if log.performed_by and log.performed_by != "SYSTEM":
            u = db.get(User, log.performed_by)
            if u:
                user_name = u.name
                user_role = log.user_role or u.role

        enriched.append({
            "id": log.id,
            "event_type": log.event_type,
            "description": log.description,
            "performed_by": log.performed_by,
            "performed_by_name": user_name,
            "user_role": user_role,
            "related_module": log.related_module,
            "related_entity_id": log.related_entity_id,
            "remarks": log.remarks,
            "created_at": log.created_at,
        })
    return enriched
