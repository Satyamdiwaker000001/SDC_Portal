from fastapi import APIRouter, Depends, HTTPException, UploadFile, File as FastAPIFile, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from sqlmodel import Session
from typing import Any, Optional
import os
import uuid
import shutil

from ...api import deps
from ...models.models import File as DBFile, User

router = APIRouter()

class FileUpdate(BaseModel):
    original_name: Optional[str] = None

@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_file(
    file: UploadFile = FastAPIFile(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload file and record metadata
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    upload_dir = os.path.join(base_dir, "static", "uploads")
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    file_id = str(uuid.uuid4())
    extension = file.filename.split(".")[-1] if "." in file.filename else "dat"
    stored_name = f"{file_id}.{extension}"
    file_path = os.path.join(upload_dir, stored_name)

    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Determine file size
    size = os.path.getsize(file_path)

    db_file = DBFile(
        id=file_id,
        original_name=file.filename,
        stored_name=stored_name,
        mime_type=file.content_type or "application/octet-stream",
        size=size
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

@router.get("/{fileId}")
def get_file_metadata(
    fileId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get file metadata details
    """
    file = db.get(DBFile, fileId)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file

@router.get("/{fileId}/download")
def download_file(
    fileId: str,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Download/stream file payload
    """
    file = db.get(DBFile, fileId)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    file_path = os.path.join(base_dir, "static", "uploads", file.stored_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File payload not found on disk")

    return FileResponse(file_path, media_type=file.mime_type, filename=file.original_name)

@router.patch("/{fileId}")
def update_file_metadata(
    fileId: str,
    update: FileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update file metadata properties
    """
    file = db.get(DBFile, fileId)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    if update.original_name is not None:
        file.original_name = update.original_name
    db.add(file)
    db.commit()
    db.refresh(file)
    return file

@router.delete("/{fileId}")
def delete_file(
    fileId: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete file and remove from disk
    """
    file = db.get(DBFile, fileId)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    file_path = os.path.join(base_dir, "static", "uploads", file.stored_name)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(file)
    db.commit()
    return {"status": "SUCCESS", "message": "File deleted from system"}
