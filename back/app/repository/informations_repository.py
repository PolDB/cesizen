import mysql.connector
from datetime import date


class InformationsRepository:
    def __init__(self, db_config):
        self.db_config = db_config

    def _get_connection(self):
        return mysql.connector.connect(**self.db_config)

    def get_all_active(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM Information_content WHERE Is_activate = TRUE ORDER BY Creation_date DESC"
        )
        result = cursor.fetchall()
        conn.close()
        return result

    def get_by_id(self, content_id: int):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM Information_content WHERE content_id = %s", (content_id,)
        )
        result = cursor.fetchone()
        conn.close()
        return result

    def create(self, title: str, description: str, type: str):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            """INSERT INTO Information_content
               (Title, Description, Creation_date, Modification_date, Is_activate, Type)
               VALUES (%s, %s, %s, %s, TRUE, %s)""",
            (title, description, date.today(), date.today(), type)
        )
        conn.commit()
        content_id = cursor.lastrowid
        conn.close()
        return content_id

    def update(self, content_id: int, title, description, is_activate):
        conn = self._get_connection()
        cursor = conn.cursor()
        fields = []
        values = []
        if title is not None:
            fields.append("Title = %s")
            values.append(title)
        if description is not None:
            fields.append("Description = %s")
            values.append(description)
        if is_activate is not None:
            fields.append("Is_activate = %s")
            values.append(is_activate)
        if fields:
            fields.append("Modification_date = %s")
            values.append(date.today())
            values.append(content_id)
            cursor.execute(
                f"UPDATE Information_content SET {', '.join(fields)} WHERE content_id = %s",
                tuple(values)
            )
            conn.commit()
        conn.close()

    def delete(self, content_id: int):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM Information_content WHERE content_id = %s", (content_id,)
        )
        conn.commit()
        conn.close()