import pytest
from unittest.mock import MagicMock, patch, call
from app.repository.account_repository import AccountRepository


@pytest.fixture
def repo():
    """AccountRepository avec une connexion MySQL mockée"""
    with patch("app.repository.account_repository.mysql.connector.connect") as mock_connect:
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_conn.cursor.return_value = mock_cursor
        mock_connect.return_value = mock_conn

        r = AccountRepository(db_config={})
        yield r, mock_conn, mock_cursor


class TestGetAccountByEmail:
    def test_retourne_utilisateur_existant(self, repo):
        r, mock_conn, mock_cursor = repo
        mock_cursor.fetchone.return_value = {
            "id_user": 1, "email": "jean@test.com", "Name": "Jean"
        }

        result = r.get_account_by_email("jean@test.com")

        mock_cursor.execute.assert_called_once()
        assert result["email"] == "jean@test.com"

    def test_retourne_none_si_inexistant(self, repo):
        r, mock_conn, mock_cursor = repo
        mock_cursor.fetchone.return_value = None

        result = r.get_account_by_email("inconnu@test.com")

        assert result is None


class TestAddAccount:
    def test_insertion_retourne_id(self, repo):
        r, mock_conn, mock_cursor = repo
        mock_cursor.lastrowid = 42

        result = r.add_account("Jean", "Dupont", "jean@test.com", "hashedmdp")

        assert result == 42
        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()

    def test_insertion_avec_bons_parametres(self, repo):
        r, mock_conn, mock_cursor = repo
        mock_cursor.lastrowid = 1

        r.add_account("Jean", "Dupont", "jean@test.com", "hashedmdp")

        args = mock_cursor.execute.call_args[0]
        assert "Jean" in args[1]
        assert "Dupont" in args[1]
        assert "jean@test.com" in args[1]
        assert "hashedmdp" in args[1]


class TestGetAllAccounts:
    def test_retourne_liste(self, repo):
        r, mock_conn, mock_cursor = repo
        mock_cursor.fetchall.return_value = [
            {"id_user": 1, "Name": "Jean"},
            {"id_user": 2, "Name": "Marie"},
        ]

        result = r.get_all_accounts()

        assert len(result) == 2
        assert result[0]["Name"] == "Jean"


class TestDeleteAccount:
    def test_suppression_appelle_execute_et_commit(self, repo):
        r, mock_conn, mock_cursor = repo

        r.delete_account(1)

        mock_cursor.execute.assert_called_once()
        mock_conn.commit.assert_called_once()