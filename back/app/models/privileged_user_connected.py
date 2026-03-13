from .account_user import Account_user

class PrivilegedUserConnected(Account_user):
    def __init__(self, username: str, email: str):
        super().__init__(username, email)

    def modyfy_password(self, bdd, new_password):
        self.set_password(self.__password__, new_password)
        bdd.update_password(self.__username__, new_password)
    
    def delete_account(self, bdd):
        bdd.delete_account(self.__username__)   
    
    def readAccount(self, bdd):
        return bdd.get_account(self.__username__)
    
    def updateAccount(self, bdd, new_username=None, new_email=None):
        pass