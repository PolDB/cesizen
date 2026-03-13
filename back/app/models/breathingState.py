from abc import ABC, abstractmethod

class BreathingState(ABC):

    def __init__(self, breathing):
        self._breathing = breathing

    @abstractmethod
    def _render(self):
        pass

    @abstractmethod
    def _inProgress(self):
        pass

    @abstractmethod
    def _pause(self):
        pass

    @abstractmethod
    def _finish(self):
        pass

    def getBreathing(self):
        return self._breathing
    
    def setBreathing(self, breathing): 
        self._breathing = breathing