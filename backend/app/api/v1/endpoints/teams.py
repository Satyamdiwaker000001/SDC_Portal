from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlmodel import Session, select, delete
from datetime import datetime
import csv
import io

from ....api import deps
from ....models.models import Team, Member, TeamMemberLink, User
from ....schemas.team import TeamCreate, TeamUpdate, TeamOut

router = APIRouter()

@router.get("/", response_model=List[TeamOut])
def read_teams(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve teams.
    """
    teams = db.exec(select(Team).offset(skip).limit(limit)).all()
    return teams

@router.post("/", response_model=TeamOut)
def create_team(
    *,
    db: Session = Depends(deps.get_db),
    team_in: TeamCreate,
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new squad (Admin only).
    """
    # Squad Size Validation
    if not (2 <= len(team_in.memberIds) <= 4):
        raise HTTPException(status_code=400, detail="Squad size violation: Must be 2-4 operatives")

    # Project multi-assignment allowed per admin protocols
    team = Team(
        id=team_in.id or f"TEAM-{int(datetime.utcnow().timestamp())}",
        name=team_in.name,
        leaderId=team_in.leaderId
    )
    db.add(team)
    
    # Add members via link table
    for member_id in team_in.memberIds:
        link = TeamMemberLink(team_id=team.id, member_id=member_id)
        db.add(link)
        
    db.commit()
    db.refresh(team)
    return team

@router.get("/{id}", response_model=Team)
def read_team_by_id(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get team detail by ID.
    """
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team

@router.patch("/{id}", response_model=TeamOut)
def update_team(
    id: str,
    team_update: TeamUpdate,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Update team (Admin only).
    """
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    update_data = team_update.model_dump(exclude_unset=True)
    
    if "memberIds" in update_data:
        # Clear existing links and add new ones
        db.exec(delete(TeamMemberLink).where(TeamMemberLink.team_id == id))
        for mid in update_data["memberIds"]:
            db.add(TeamMemberLink(team_id=id, member_id=mid))
        del update_data["memberIds"]

    for key, value in update_data.items():
        setattr(team, key, value)
    
    db.add(team)
    db.commit()
    db.refresh(team)
    return team

@router.post("/bulk")
def bulk_create_teams(
    *,
    db: Session = Depends(deps.get_db),
    teams_in: List[TeamCreate],
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Bulk create squads (Admin only).
    """
    for t_in in teams_in:
        team = Team(id=t_in.id or f"TEAM-{int(datetime.utcnow().timestamp())}", name=t_in.name, leaderId=t_in.leaderId)
        db.add(team)
        for mid in t_in.memberIds:
            db.add(TeamMemberLink(team_id=team.id, member_id=mid))
    db.commit()
    return {"status": "SUCCESS", "message": f"{len(teams_in)} squads forged"}

@router.post("/bulk/csv")
async def bulk_forge_teams_csv(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Bulk Forge squads via CSV.
    Headers: name, leaderId, memberIds (semi-colon separated)
    """
    content = await file.read()
    decoded = content.decode('utf-8')
    reader = csv.DictReader(io.StringIO(decoded))
    
    results = {"success": 0, "errors": []}
    from ....models.models import Project
    
    for i, row in enumerate(reader):
        try:
            member_ids = [m.strip() for m in row['memberIds'].split(';') if m.strip()]
            if not (2 <= len(member_ids) <= 4):
                raise ValueError("Squad size violation: Must be 2-4 operatives")
            
            # Project multi-assignment allowed per admin protocols

            team = Team(
                id=f"TEAM-{int(datetime.utcnow().timestamp())}-{i}",
                name=row['name'],
                leaderId=row['leaderId']
            )
            db.add(team)
            for mid in member_ids:
                db.add(TeamMemberLink(team_id=team.id, member_id=mid))
            results["success"] += 1
            
        except Exception as e:
            results["errors"].append({"row": i + 1, "error": str(e), "data": row})
        
    db.commit()
    return results

@router.delete("/{id}")
def delete_team(
    id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Disband squad (Admin only).
    """
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    db.delete(team)
    db.commit()
    return {"status": "SQUAD_DISBANDED"}

@router.post("/{id}/members")
def add_team_member(
    id: str,
    member_id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Inject member into squad (Admin only).
    """
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if already a member
    link = db.get(TeamMemberLink, (id, member_id))
    if link:
        return {"status": "ALREADY_MEMBER"}
        
    db.add(TeamMemberLink(team_id=id, member_id=member_id))
    db.commit()
    return {"status": "MEMBER_INJECTED"}

@router.delete("/{id}/members/{member_id}")
def remove_team_member(
    id: str,
    member_id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Extract member from squad (Admin only).
    """
    link = db.get(TeamMemberLink, (id, member_id))
    if not link:
        raise HTTPException(status_code=404, detail="Member not in team")
    
    db.delete(link)
    db.commit()
    return {"status": "MEMBER_EXTRACTED"}

@router.patch("/{id}/leader")
def assign_team_leader(
    id: str,
    leader_id: str,
    db: Session = Depends(deps.get_db),
    current_admin: User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Assign squad leader (Admin only).
    """
    team = db.get(Team, id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    team.leaderId = leader_id
    db.add(team)
    db.commit()
    return {"status": "LEADER_ASSIGNED", "leaderId": leader_id}
