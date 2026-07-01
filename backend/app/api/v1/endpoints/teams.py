from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
from ....api import deps
from ....models.models import Team, TeamMember, User

router = APIRouter()

class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None

class TeamOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    created_by: str

class TeamMemberCreate(BaseModel):
    user_id: str
    designation: Optional[str] = "member"

class TeamMemberOut(BaseModel):
    id: str
    team_id: str
    user_id: str
    designation: str

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TeamOut)
def create_team(
    team_in: TeamCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    team = Team(
        id=str(uuid.uuid4()),
        name=team_in.name,
        description=team_in.description,
        created_by=current_admin.id
    )
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.get("/", response_model=List[TeamOut])
def list_teams(
    db: Session = Depends(deps.get_db),
) -> Any:
    return db.exec(select(Team)).all()

@router.get("/{id}", response_model=TeamOut)
def get_team(
    id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.post("/{id}/members", status_code=status.HTTP_201_CREATED, response_model=TeamMemberOut)
def add_team_member(
    id: str,
    member_in: TeamMemberCreate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    user = db.get(User, member_in.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    member = TeamMember(
        id=str(uuid.uuid4()),
        team_id=id,
        user_id=member_in.user_id,
        designation=member_in.designation
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.get("/{id}/members", response_model=List[TeamMemberOut])
def list_team_members(
    id: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    return db.exec(select(TeamMember).where(TeamMember.team_id == id)).all()
