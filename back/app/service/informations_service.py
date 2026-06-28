from app.repository.informations_repository import InformationsRepository


class InformationsService:
    def __init__(self, db_config):
        self.repository = InformationsRepository(db_config)

    def get_all(self):
        return self.repository.get_all_active()

    def get_by_id(self, content_id: int):
        return self.repository.get_by_id(content_id)

    def create(self, title: str, description: str, type: str):
        content_id = self.repository.create(title, description, type)
        return {"content_id": content_id, "message": "Contenu créé."}

    def update(self, content_id: int, title, description, is_activate):
        self.repository.update(content_id, title, description, is_activate)

    def delete(self, content_id: int):
        self.repository.delete(content_id)