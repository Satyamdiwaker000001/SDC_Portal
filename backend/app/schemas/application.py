from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class ApplicationBase(BaseModel):
    name: str
    email: EmailStr
    contact: str
    class_name: str
    interested: str
    photo_url: Optional[str] = None
    resume_url: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: str

class ApplicationOut(ApplicationBase):
    id: int
    status: str
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)
