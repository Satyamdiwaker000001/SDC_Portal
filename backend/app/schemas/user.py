from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = "developer"
    branch: Optional[str] = "N/A"
    admission_year: Optional[int] = 0
    passout_year: Optional[int] = 0
    membership_status: Optional[str] = "active"
    tech_stack: Optional[List[str]] = []
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    image: Optional[str] = None          # used on create; maps to profile_image column
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    name: str

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None
    profile_image: Optional[str] = None  # allow direct update by field name too

class UserOut(UserBase):
    id: str
    profile_image: Optional[str] = None  # reads the actual DB column
    performance_score: float = 0.0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


