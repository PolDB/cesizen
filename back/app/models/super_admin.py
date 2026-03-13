from .account_user import Account_user  

class SuperAdmin(Account_user):
    def __init__(self, username: str, email: str):
        super().__init__(username, email)
    
    def create_user(self, bdd, username, password, state=None, export_date=None):
        new_user = Account_user(username, password, state, export_date)
        new_user.create_account(bdd)
    
    def read_user(self, bdd, username):
        return bdd.get_account(username)
    
    def update_user(self, bdd, username, new_username=None, new_email=None, new_password=None, new_state=None, new_export_date=None):
        user = bdd.get_account(username)
    def delete_user(self, bdd, username):
        bdd.delete_account(username)    
    
    def read_user_by_id(self, bdd, user_id):
        return bdd.get_account_by_id(user_id)   
