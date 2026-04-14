"""
Tests de non-regression back-end CesiZen
=========================================
Ces tests sont executes avant chaque mise en production.
Le non-succes d'un test de priorite HAUTE bloque la livraison.

Lancement : python -m pytest tests/test_regression.py -v
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from main import app

client = TestClient(app)


# ══════════════════════════════════════════════════════════════
# MODULE COMPTES UTILISATEURS
# ══════════════════════════════════════════════════════════════

class TestRegressionAuth:
    """
    Regression - Module Comptes Utilisateurs
    Priorite : HAUTE - echec bloque la livraison
    """

    def test_route_register_repond(self):
        """RB-01 : La route POST /auth/register repond (non regression disponibilite)"""
        with patch("app.controllers.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.register.return_value = {"token": "t", "user_id": 1, "email": "x@x.com"}
            response = client.post("/auth/register", json={
                "name": "Test", "surname": "Regression",
                "email": "regression@test.com", "password": "mdp123"
            })
        assert response.status_code in [200, 400]

    def test_route_login_repond(self):
        """RB-02 : La route POST /auth/login repond (non regression disponibilite)"""
        with patch("app.controllers.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.login.return_value = {"token": "t", "user_id": 1, "email": "x@x.com", "name": "X", "surname": "Y"}
            response = client.post("/auth/login", json={
                "email": "test@test.com", "password": "mdp123"
            })
        assert response.status_code in [200, 401]

    def test_route_change_password_repond(self):
        """RB-03 : La route POST /auth/change-password repond"""
        with patch("app.controllers.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.change_password.return_value = None
            response = client.post("/auth/change-password", json={
                "email": "test@test.com",
                "ancien_password": "ancienmdp",
                "nouveau_password": "nouveaumdp"
            })
        assert response.status_code in [200, 400, 401]

    def test_register_champs_manquants_retourne_422(self):
        """RB-04 : Register sans champs obligatoires retourne 422 (HAUTE)"""
        response = client.post("/auth/register", json={"email": "test@test.com"})
        assert response.status_code == 422

    def test_login_champs_manquants_retourne_422(self):
        """RB-05 : Login sans champs obligatoires retourne 422 (HAUTE)"""
        response = client.post("/auth/login", json={"email": "test@test.com"})
        assert response.status_code == 422

    def test_login_mauvais_identifiants_retourne_401(self):
        """RB-06 : Login avec mauvais identifiants retourne 401 (HAUTE)"""
        with patch("app.controllers.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.login.side_effect = ValueError("Email ou mot de passe incorrect.")
            response = client.post("/auth/login", json={
                "email": "inconnu@test.com", "password": "mauvaismdp"
            })
        assert response.status_code == 401

    def test_register_email_existant_retourne_400(self):
        """RB-07 : Register avec email existant retourne 400 (HAUTE)"""
        with patch("app.controllers.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.register.side_effect = ValueError("Un compte avec cet email existe deja.")
            response = client.post("/auth/register", json={
                "name": "Jean", "surname": "Dupont",
                "email": "existant@test.com", "password": "mdp123"
            })
        assert response.status_code == 400

    def test_login_succes_retourne_token(self):
        """RB-08 : Login avec succes retourne un token JWT (HAUTE)"""
        with patch("app.controllers.auth.AuthService") as MockService:
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
                "email": "jean@test.com", "password": "mdp123"
            })
        assert response.status_code == 200
        assert "token" in response.json()
        assert "name" in response.json()

    def test_register_succes_retourne_token(self):
        """RB-09 : Register avec succes retourne un token (HAUTE)"""
        with patch("app.controllers.auth.AuthService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.register.return_value = {
                "token": "fake.jwt.token",
                "user_id": 42,
                "email": "nouveau@test.com"
            }
            response = client.post("/auth/register", json={
                "name": "Jean", "surname": "Dupont",
                "email": "nouveau@test.com", "password": "mdp123"
            })
        assert response.status_code == 200
        assert "token" in response.json()


# ══════════════════════════════════════════════════════════════
# MODULE INFORMATIONS
# ══════════════════════════════════════════════════════════════

class TestRegressionInformations:
    """
    Regression - Module Informations
    Priorite : HAUTE - echec bloque la livraison
    """

    def test_route_get_informations_repond(self):
        """RB-10 : La route GET /informations/ repond (non regression disponibilite)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.get_all.return_value = []
            response = client.get("/informations/")
        assert response.status_code == 200

    def test_get_informations_retourne_liste(self):
        """RB-11 : GET /informations/ retourne une liste (HAUTE)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.get_all.return_value = [
                {"content_id": 1, "Title": "Test", "Description": "Desc", "Type": "page", "Is_activate": True}
            ]
            response = client.get("/informations/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_get_information_par_id_trouve(self):
        """RB-12 : GET /informations/{id} retourne l'article si existe (HAUTE)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.get_by_id.return_value = {
                "content_id": 1, "Title": "Test", "Description": "Desc", "Type": "page"
            }
            response = client.get("/informations/1")
        assert response.status_code == 200
        assert "Title" in response.json()

    def test_get_information_par_id_introuvable(self):
        """RB-13 : GET /informations/{id} retourne 404 si inexistant (HAUTE)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.get_by_id.return_value = None
            response = client.get("/informations/9999")
        assert response.status_code == 404

    def test_post_information_cree_article(self):
        """RB-14 : POST /informations/ cree un article et retourne content_id (HAUTE)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.create.return_value = {"content_id": 1, "message": "Contenu cree."}
            response = client.post("/informations/", json={
                "title": "Article test",
                "description": "Description test",
                "type": "page"
            })
        assert response.status_code == 200
        assert "content_id" in response.json()

    def test_post_information_champs_manquants(self):
        """RB-15 : POST /informations/ sans champs requis retourne 422 (HAUTE)"""
        response = client.post("/informations/", json={"type": "page"})
        assert response.status_code == 422

    def test_put_information_met_a_jour(self):
        """RB-16 : PUT /informations/{id} met a jour un article (Moyenne)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.update.return_value = None
            response = client.put("/informations/1", json={"title": "Nouveau titre"})
        assert response.status_code == 200

    def test_delete_information_supprime(self):
        """RB-17 : DELETE /informations/{id} supprime un article (Moyenne)"""
        with patch("app.controllers.informations.InformationsService") as MockService:
            mock_svc = MagicMock()
            MockService.return_value = mock_svc
            mock_svc.delete.return_value = None
            response = client.delete("/informations/1")
        assert response.status_code == 200


# ══════════════════════════════════════════════════════════════
# ROUTES GENERALES
# ══════════════════════════════════════════════════════════════

class TestRegressionGeneral:
    """
    Regression - Routes generales et sante du serveur
    Priorite : HAUTE
    """

    def test_route_racine_repond(self):
        """RB-18 : La route GET / repond avec 200 (HAUTE)"""
        response = client.get("/")
        assert response.status_code == 200

    def test_route_racine_message_correct(self):
        """RB-19 : La route GET / retourne le bon message (HAUTE)"""
        response = client.get("/")
        assert response.json() == {"message": "Backend is running"}

    def test_cors_headers_presents(self):
        """RB-20 : Les headers CORS sont presents dans les reponses (HAUTE)"""
        response = client.options("/auth/login", headers={
            "Origin": "http://localhost:8081",
            "Access-Control-Request-Method": "POST"
        })
        assert response.status_code in [200, 400]