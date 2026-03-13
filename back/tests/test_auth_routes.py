import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)


# ─── Tests route /auth/register ──────────────────────────────────────────────

class TestRegisterRoute:
    def test_register_succes(self):
        with patch("app.routes.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.register.return_value = {
                "token": "fake.jwt.token",
                "user_id": 1,
                "email": "jean@test.com"
            }

            response = client.post("/auth/register", json={
                "name": "Jean",
                "surname": "Dupont",
                "email": "jean@test.com",
                "password": "mdp123"
            })

            assert response.status_code == 200
            assert "token" in response.json()

    def test_register_email_existant(self):
        with patch("app.routes.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.register.side_effect = ValueError("Un compte avec cet email existe déjà.")

            response = client.post("/auth/register", json={
                "name": "Jean",
                "surname": "Dupont",
                "email": "jean@test.com",
                "password": "mdp123"
            })

            assert response.status_code == 400
            assert "existe déjà" in response.json()["detail"]

    def test_register_champs_manquants(self):
        response = client.post("/auth/register", json={
            "email": "jean@test.com"
        })
        assert response.status_code == 422


# ─── Tests route /auth/login ─────────────────────────────────────────────────

class TestLoginRoute:
    def test_login_succes(self):
        with patch("app.routes.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.login.return_value = {
                "token": "fake.jwt.token",
                "user_id": 1,
                "email": "jean@test.com",
                "name": "Jean",
                "surname": "Dupont"
            }

            response = client.post("/auth/login", json={
                "email": "jean@test.com",
                "password": "mdp123"
            })

            assert response.status_code == 200
            assert "token" in response.json()
            assert response.json()["name"] == "Jean"

    def test_login_identifiants_invalides(self):
        with patch("app.routes.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.login.side_effect = ValueError("Email ou mot de passe incorrect.")

            response = client.post("/auth/login", json={
                "email": "jean@test.com",
                "password": "mauvaismdp"
            })

            assert response.status_code == 401
            assert "incorrect" in response.json()["detail"]

    def test_login_champs_manquants(self):
        response = client.post("/auth/login", json={
            "email": "jean@test.com"
        })
        assert response.status_code == 422


# ─── Test route racine ────────────────────────────────────────────────────────

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Backend is running"}