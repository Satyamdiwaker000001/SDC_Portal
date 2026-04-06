from typing import List, Optional
from pydantic import BaseModel, ConfigDict

# --- TASK_SCHEMAS ---

class TaskBase(BaseModel):
    moduleName: str
    title: str
    assignedTo: str # Name or ID of member
    status: str = "TODO"

class TaskCreate(TaskBase):
    id: str

class TaskOut(TaskBase):
    id: str
    project_id: str
    
    model_config = ConfigDict(from_attributes=True)
    reviewFeedback: Optional[str] = None

class TaskReview(BaseModel):
    action: str # "APPROVE" or "REJECT"
    feedback: Optional[str] = None

# --- PROJECT_SCHEMAS ---

class ProjectBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    deadline: Optional[str] = None
    teamId: Optional[str] = None

class ProjectCreate(ProjectBase):
    name: str
    type: str # Cybersecurity, Web_App etc
    deadline: str
    id: Optional[str] = None # Auto-generated if not provided

class ProjectBulkCreate(BaseModel):
    projects: List[ProjectCreate]

class ProjectActivation(BaseModel):
    project_ids: List[str]

class ProjectUpdate(ProjectBase):
    status: Optional[str] = None
    progress: Optional[int] = None

class ProjectOut(ProjectBase):
    id: str
    status: str
    progress: int
    
    model_config = ConfigDict(from_attributes=True)

class ProjectAdminPatch(BaseModel):
    status: Optional[str] = None
    deadline: Optional[str] = None
