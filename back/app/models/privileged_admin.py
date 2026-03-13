from .account_user import account_user

class PrivilegedAdmin(account_user):
    def __init__(self, username: str, email: str):
        super().__init__(username, email)

def create_page_content(self, bdd):
    pass

def delete_page_content(self, bdd):
    pass

def update_page_content(self, bdd):
    pass    

def read_page_content(self, bdd):
    pass    
