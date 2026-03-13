class Account_user:
    def __init__(self, username, password, state=None, export_date=None):
        self.__username__ = username
        self.__password__ = password
        self.__state__= state 
        self.__active__ = False
        self.__export_date__= export_date
    
    def get_username(self, __username__):
        return self.__username__    
    def set_username(self, __username__, username):
        self.__username__ = username

    def get_password(self, __password__):
        return self.__password__
    def set_password(self, __password__, password):
        self.__password__ = password

    def get_state(self, __state__):
        return self.__state__
    def set_state(self, __state__, state):  
        self.__state__ = state

    def get_active(self, __active__):
        return self.__active__  
    def set_active(self, __active__, active):
        self.__active__ = active
        
    def get_export_date(self, __export_date__):
        return self.__export_date__
    def set_export_date(self, __export_date__, export_date):
        self.__export_date__ = export_date
    
    def create_account(self, bdd):
        bdd.insert_account(self.__username__, self.__password__, self.__state__, self.__active__, self.__export_date__)
    
    def login(self, bdd):
        pass

    def read_pages_content(self, bdd):
        pass
