from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
import uuid
from ....api import deps
from ....models.models import Interaction, User

router = APIRouter()

class InteractionCreate(BaseModel):
    entity_type: str
    entity_id: str
    interaction_type: str
    content: Optional[str] = None
    rating: Optional[int] = None
    decision: Optional[str] = None

class InteractionOut(BaseModel):
    id: str
    user_id: str
    entity_type: str
    entity_id: str
    interaction_type: str
    content: Optional[str]
    rating: Optional[int]
    decision: Optional[str]

@router.get("/", response_model=List[InteractionOut])
def list_interactions(
    entity_type: Optional[str] = None,
    entity_id: Optional[str] = None,
    interaction_type: Optional[str] = None,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get generic interactions, optionally filtered by entity/type.
    """
    query = select(Interaction)
    if entity_type:
        query = query.where(Interaction.entity_type == entity_type)
    if entity_id:
        query = query.where(Interaction.entity_id == entity_id)
    if interaction_type:
        query = query.where(Interaction.interaction_type == interaction_type)
        
    return db.exec(query).all()

@router.post("/", response_model=InteractionOut, status_code=status.HTTP_201_CREATED)
def create_interaction(
    *,
    db: Session = Depends(deps.get_db),
    interaction_in: InteractionCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create a generic interaction (comment, review, reaction, feedback).
    """
    interaction = Interaction(
        id=str(uuid.uuid4()),
        user_id=current_user.id,
        entity_type=interaction_in.entity_type,
        entity_id=interaction_in.entity_id,
        interaction_type=interaction_in.interaction_type,
        content=interaction_in.content,
        rating=interaction_in.rating,
        decision=interaction_in.decision
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction

@router.delete("/{id}")
def delete_interaction(
    id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    interaction = db.get(Interaction, id)
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
        
    if interaction.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    db.delete(interaction)
    db.commit()
    return {"status": "SUCCESS", "message": "Interaction deleted"}
