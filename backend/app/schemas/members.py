from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict

class MemberBase(BaseModel):
    name: str
    email: EmailStr
    spec: str
    joinDate: str
    retirementDate: Optional[str] = None
    techStack: List[str] = []
    image: Optional[str] = None

class MemberCreate(MemberBase):
    password: Optional[str] = None

class MemberUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    spec: Optional[str] = None
    joinDate: Optional[str] = None
    retirementDate: Optional[str] = None
    techStack: Optional[List[str]] = None
    image: Optional[str] = None

class MemberOut(MemberBase):
    id: str
    status: str

    model_config = ConfigDict(from_attributes=True)
