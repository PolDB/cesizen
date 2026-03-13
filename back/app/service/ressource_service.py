from app.repository.account_repository import AccountRepository

class AccountService:
    def __init__(self, db_config=None):
        self.account_repository = AccountRepository(db_config)

    def get_all_accounts(self):
        return self.account_repository.get_all_accounts()

    def get_account_by_id(self, account_id):
        return self.account_repository.get_account_by_id(account_id)

    def add_account(self, username, email):
        return self.account_repository.add_account(username, email)

    def update_account(self, account_id, username, email):
        self.account_repository.update_account(account_id, username, email)

    def delete_account(self, account_id):
        self.account_repository.delete_account(account_id)