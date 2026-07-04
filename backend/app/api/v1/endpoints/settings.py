from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Any
from ....api import deps
from ....models.models import SystemSetting, User

router = APIRouter()

@router.get("/{key}")
def get_setting(key: str, db: Session = Depends(deps.get_db)) -> Any:
    """
    Get a system setting by key. Publicly accessible.
    """
    setting = db.get(SystemSetting, key)
    if not setting:
        return {"key": key, "value": "false"} # Default fallback
    return setting

@router.patch("/{key}")
def update_setting(
    key: str,
    value: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin)
) -> Any:
    """
    Update a system setting by key. Admin only.
    """
    setting = db.get(SystemSetting, key)
    if not setting:
        setting = SystemSetting(key=key, value=value)
        db.add(setting)
    else:
        setting.value = value
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting
