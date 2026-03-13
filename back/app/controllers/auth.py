from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.service.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])

# Config MySQL — à déplacer dans un .env plus tard
DB_CONFIG = {
    "host": "db",
    "user": "cda",
    "password": "cda",
    "database": "bdd",
}


class RegisterSchema(BaseModel):
    name: str
    surname: str
    email: str
    password: str


class LoginSchema(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(data: RegisterSchema):
    service = AuthService(DB_CONFIG)
    try:
        result = service.register(data.name, data.surname, data.email, data.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
def login(data: LoginSchema):
    service = AuthService(DB_CONFIG)
    try:
        result = service.login(data.email, data.password)
        return result
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))