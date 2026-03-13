from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.repository.account_repository import AccountRepository

SECRET_KEY = "cesizen_secret_key_2026"
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24  # 24h

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db_config):
        self.repository = AccountRepository(db_config)

    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    def create_token(self, user_id: int, email: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
        payload = {"sub": str(user_id), "email": email, "exp": expire}
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    def register(self, name: str, surname: str, email: str, password: str):
        # Vérifier si l'email existe déjà
        existing = self.repository.get_account_by_email(email)
        if existing:
            raise ValueError("Un compte avec cet email existe déjà.")

        hashed = self.hash_password(password)
        user_id = self.repository.add_account(name, surname, email, hashed)
        token = self.create_token(user_id, email)
        return {"token": token, "user_id": user_id, "email": email}

    def login(self, email: str, password: str):
        user = self.repository.get_account_by_email(email)
        if not user:
            raise ValueError("Email ou mot de passe incorrect.")

        if not self.verify_password(password, user["Password"]):
            raise ValueError("Email ou mot de passe incorrect.")

        token = self.create_token(user["id_user"], user["email"])
        return {
            "token": token,
            "user_id": user["id_user"],
            "email": user["email"],
            "name": user["Name"],
            "surname": user["Surname"],
        }