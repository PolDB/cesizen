class  breathing:
    def __init__(self, id, name:str, description:str, exercise:state):
        self.__name__ = name
        self.__description__ = description  
        self.__exercise__ = state
    
    def get_name(self, __name__):
        return self.__name__    
    
    def set_name(self, __name__, name):     
        self.__name__ = name

    def get_description(self, __description__):         
        return self.__description__
    
    def set_description(self, __description__, description):
        self.__description__ = description  
    
    def get_exercise(self, __exercise__):
        return self.__exercise__    
    
    def set_exercise(self, __exercise__, exercise):
        self.__exercise__ = exercise

    def change_state(self, bdd):
        pass
    