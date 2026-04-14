from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.repository.account_repository import AccountRepository

router = APIRouter(prefix="/admin", tags=["admin"])

DB_CONFIG = {
    "host": "db",
    "user": "cda",
    "password": "cda",
    "database": "bdd",
}


class UpdateRoleSchema(BaseModel):
    state: str  # 'user', 'admin', 'suspendu', 'supprimer'


@router.get("/users")
def get_all_users():
    repo = AccountRepository(DB_CONFIG)
    return repo.get_all_accounts()


@router.put("/users/{user_id}/role")
def update_role(user_id: int, data: UpdateRoleSchema):
    allowed = ['user', 'admin', 'suspendu', 'supprimer']
    if data.state not in allowed:
        raise HTTPException(status_code=400, detail=f"Role invalide. Valeurs acceptees : {allowed}")
    repo = AccountRepository(DB_CONFIG)
    user = repo.get_account_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    repo.update_role(user_id, data.state)
    return {"message": f"Role mis a jour : {data.state}"}


@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    repo = AccountRepository(DB_CONFIG)
    user = repo.get_account_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    repo.delete_account(user_id)
    return {"message": "Utilisateur supprime."}