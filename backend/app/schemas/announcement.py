from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AnnouncementBase(BaseModel):
    title: str
    body: str
    priority: str # Normal, Important, Urgent
    is_global: bool = True

class AnnouncementCreate(AnnouncementBase):
    team_ids: Optional[List[str]] = None

class AnnouncementOut(AnnouncementBase):
    id: int
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)
