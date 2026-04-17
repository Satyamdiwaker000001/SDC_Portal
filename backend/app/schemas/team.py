from typing import List, Optional
from pydantic import BaseModel, ConfigDict

# Shared properties
class TeamBase(BaseModel):
    name: Optional[str] = None
    leaderId: Optional[str] = None

# Properties to receive via API on creation
class TeamCreate(TeamBase):
    name: str
    leaderId: str
    memberIds: List[str] = []
    specialCaseOverride: bool = False

# Properties to receive via API on update
class TeamUpdate(TeamBase):
    memberIds: Optional[List[str]] = None

class TeamOut(TeamBase):
    id: str
    
    model_config = ConfigDict(from_attributes=True)
