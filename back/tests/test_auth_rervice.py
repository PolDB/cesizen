import pytest
from unittest.mock import MagicMock, patch
from app.service.auth_service import AuthService


# ─── Fixtures ───────────────────────────────────────────────────────────────

@pytest.fixture
def service():
    """AuthService avec un repository mocké (pas de vraie BDD)"""
    with patch("app.service.auth_service.AccountRepository") as MockRepo:
        mock_repo = MagicMock()
        MockRepo.return_value = mock_repo
        svc = AuthService(db_config={})
        svc.repository = mock_repo
        yield svc, mock_repo


# ─── Tests hash mot de passe ────────────────────────────────────────────────

class TestHashPassword:
    def test_hash_different_du_mot_de_passe(self, service):
        svc, _ = service
        hashed = svc.hash_password("monmotdepasse")
        assert hashed != "monmotdepasse"

    def test_hash_est_verifiable(self, service):
        svc, _ = service
        hashed = svc.hash_password("monmotdepasse")
        assert svc.verify_password("monmotdepasse", hashed) is True

    def test_mauvais_mot_de_passe_echoue(self, service):
        svc, _ = service
        hashed = svc.hash_password("monmotdepasse")
        assert svc.verify_password("mauvaismdp", hashed) is False


# ─── Tests création de token ─────────────────────────────────────────────────

class TestCreateToken:
    def test_token_est_une_chaine(self, service):
        svc, _ = service
        token = svc.create_token(user_id=1, email="jean@test.com")
        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_contient_trois_parties(self, service):
        """Un JWT valide a 3 parties séparées par des points"""
        svc, _ = service
        token = svc.create_token(user_id=1, email="jean@test.com")
        assert token.count(".") == 2


# ─── Tests register ──────────────────────────────────────────────────────────

class TestRegister:
    def test_register_succes(self, service):
        svc, mock_repo = service
        mock_repo.get_account_by_email.return_value = None  # email libre
        mock_repo.add_account.return_value = 42  # id simulé

        result = svc.register("Jean", "Dupont", "jean@test.com", "mdp123")

        assert "token" in result
        assert result["email"] == "jean@test.com"
        assert result["user_id"] == 42

    def test_register_email_deja_existant(self, service):
        svc, mock_repo = service
        mock_repo.get_account_by_email.return_value = {"id_user": 1}  # email pris

        with pytest.raises(ValueError, match="existe déjà"):
            svc.register("Jean", "Dupont", "jean@test.com", "mdp123")

    def test_register_appelle_add_account(self, service):
        svc, mock_repo = service
        mock_repo.get_account_by_email.return_value = None
        mock_repo.add_account.return_value = 1

        svc.register("Jean", "Dupont", "jean@test.com", "mdp123")

        mock_repo.add_account.assert_called_once()
        args = mock_repo.add_account.call_args[0]
        assert args[0] == "Jean"
        assert args[1] == "Dupont"
        assert args[2] == "jean@test.com"
        # Le mot de passe doit être hashé, pas en clair
        assert args[3] != "mdp123"


# ─── Tests login ─────────────────────────────────────────────────────────────

class TestLogin:
    def test_login_succes(self, service):
        svc, mock_repo = service
        hashed = svc.hash_password("mdp123")
        mock_repo.get_account_by_email.return_value = {
            "id_user": 1,
            "email": "jean@test.com",
            "Password": hashed,
            "Name": "Jean",
            "Surname": "Dupont",
            "state":1
        }

        result = svc.login("jean@test.com", "mdp123")

        assert "token" in result
        assert result["email"] == "jean@test.com"
        assert result["name"] == "Jean"

    def test_login_email_inexistant(self, service):
        svc, mock_repo = service
        mock_repo.get_account_by_email.return_value = None

        with pytest.raises(ValueError, match="incorrect"):
            svc.login("inconnu@test.com", "mdp123")

    def test_login_mauvais_mot_de_passe(self, service):
        svc, mock_repo = service
        hashed = svc.hash_password("bonmdp")
        mock_repo.get_account_by_email.return_value = {
            "id_user": 1,
            "email": "jean@test.com",
            "Password": hashed,
            "Name": "Jean",
            "Surname": "Dupont",
            "state": 1
        }

        with pytest.raises(ValueError, match="incorrect"):
            svc.login("jean@test.com", "mauvaismdp")