from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from pydantic import BaseModel

from ....api import deps
from ....models.models import Setting, User

router = APIRouter()

class SettingUpdate(BaseModel):
    key: str
    value: str

@router.get("/", response_model=List[Setting])
def read_settings(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve all global settings (Any logged in user).
    """
    settings = db.exec(select(Setting)).all()
    # Initialize defaults if not present
    defaults = {
        "OPEN_RECRUITMENT": "true",
        "MAINTENANCE_MODE": "false",
        "GLOBAL_ANNOUNCEMENTS": "true",
        "SESSION_TIMEOUT_MINS": "30"
    }
    
    existing_keys = {s.key for s in settings}
    added_new = False
    
    for key, val in defaults.items():
        if key not in existing_keys:
            new_setting = Setting(key=key, value=val, description=f"System flag: {key}")
            db.add(new_setting)
            settings.append(new_setting)
            added_new = True
            
    if added_new:
        db.commit()
        
    return settings

@router.post("/", response_model=Setting)
def update_setting(
    setting_in: SettingUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update or create a global setting (Admin only).
    """
    setting = db.get(Setting, setting_in.key)
    if not setting:
        setting = Setting(key=setting_in.key, value=setting_in.value, description=f"System flag: {setting_in.key}")
    else:
        setting.value = setting_in.value
        
    db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting
