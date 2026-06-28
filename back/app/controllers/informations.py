from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.service.informations_service import InformationsService

router = APIRouter(prefix="/informations", tags=["informations"])

DB_CONFIG = {
    "host": "db",
    "user": "cda",
    "password": "cda",
    "database": "bdd",
}


class InformationCreate(BaseModel):
    title: str
    description: str
    type: str = "page"


class InformationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_activate: Optional[bool] = None


@router.get("/")
def get_all():
    service = InformationsService(DB_CONFIG)
    return service.get_all()


@router.get("/{content_id}")
def get_one(content_id: int):
    service = InformationsService(DB_CONFIG)
    result = service.get_by_id(content_id)
    if not result:
        raise HTTPException(status_code=404, detail="Contenu introuvable.")
    return result


@router.post("/")
def create(data: InformationCreate):
    service = InformationsService(DB_CONFIG)
    return service.create(data.title, data.description, data.type)


@router.put("/{content_id}")
def update(content_id: int, data: InformationUpdate):
    service = InformationsService(DB_CONFIG)
    service.update(content_id, data.title, data.description, data.is_activate)
    return {"message": "Contenu mis à jour."}


@router.delete("/{content_id}")
def delete(content_id: int):
    service = InformationsService(DB_CONFIG)
    service.delete(content_id)
    return {"message": "Contenu supprimé."}