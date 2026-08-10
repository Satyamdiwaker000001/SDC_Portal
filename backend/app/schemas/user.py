from typing import List, Optional
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from datetime import datetime

ALLOWED_EMAIL_DOMAINS = ("@rbmi.in", "@sdc.edu")

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[str] = "developer"
    branch: Optional[str] = "N/A"
    admission_year: Optional[int] = 0
    passout_year: Optional[int] = 0
    sdc_joining_year: Optional[int] = None
    membership_status: Optional[str] = "active"
    tech_stack: Optional[List[str]] = []
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    image: Optional[str] = None          # used on create; maps to profile_image column
    is_active: Optional[bool] = True

    @field_validator('email')
    @classmethod
    def validate_email_domain(cls, v: Optional[EmailStr]) -> Optional[EmailStr]:
        if v is None:
            return v
        email_str = str(v).lower().strip()
        if not any(email_str.endswith(domain) for domain in ALLOWED_EMAIL_DOMAINS):
            raise ValueError(f"Email must be a valid college email ending with @rbmi.in (or official @sdc.com / @sdc.edu). Example: cs23satyam@rbmi.in")
        return email_str

    @field_validator('admission_year', 'passout_year', 'sdc_joining_year')
    @classmethod
    def validate_positive_year(cls, v: Optional[int]) -> Optional[int]:
        if v is None:
            return v
        if v < 0:
            raise ValueError("Year value cannot be negative.")
        if v > 0 and (v < 1990 or v > 2100):
            raise ValueError("Year must be a valid 4-digit year (e.g. 2023).")
        return v

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    name: str

    @field_validator('passout_year')
    @classmethod
    def validate_passout_after_admission(cls, v: Optional[int], info) -> Optional[int]:
        admission = info.data.get('admission_year')
        if v and admission and admission > 0 and v < admission:
            raise ValueError("Passout year cannot be earlier than admission year.")
        return v

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


