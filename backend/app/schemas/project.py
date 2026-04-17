from typing import List, Optional
from pydantic import BaseModel, ConfigDict

# --- TASK_SCHEMAS ---

class TaskBase(BaseModel):
    moduleName: str
    title: str
    assignedTo: str # Name or ID of member
    status: str = "TODO"
    progress: int = 0
    whatsDone: List[str] = []
    whatsGoingOn: Optional[str] = None
    remarks: Optional[str] = None
    workLog: Optional[str] = None

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

class TaskPulse(BaseModel):
    status: str
    progress: Optional[int] = 100
    whatsDone: Optional[List[str]] = None
    whatsGoingOn: Optional[str] = None
    remarks: Optional[str] = None
    workLog: Optional[str] = None

# --- PROJECT_SCHEMAS ---

class ProjectBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None
    deadline: Optional[str] = None
    teamId: Optional[str] = None
    srsLink: Optional[str] = None
    academicYear: Optional[str] = "2024-25"
    gitHubRepo: Optional[str] = None

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
    tasks: List[TaskOut] = []
    
    model_config = ConfigDict(from_attributes=True)

class ProjectAdminPatch(BaseModel):
    status: Optional[str] = None
    deadline: Optional[str] = None
