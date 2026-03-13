from .account_user import Account_user


class User(Account_user):
    def __init__(self, username: str, email: str):
        super().__init__(username, email)

    def __str__(self):
        return f"Utilisateur: {self.username}"