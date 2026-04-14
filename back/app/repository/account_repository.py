import mysql.connector

class AccountRepository:
    def __init__(self, db_config):
        self.db_config = db_config

    def _get_connection(self):
        return mysql.connector.connect(**self.db_config)

    def get_all_accounts(self):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_user, Name, Surname, email, state, Activate, Export_date FROM Users")
        accounts = cursor.fetchall()
        conn.close()
        return accounts

    def get_account_by_id(self, account_id):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_user, Name, Surname, email, state, Activate, Export_date FROM Users WHERE id_user = %s", (account_id,))
        account = cursor.fetchone()
        conn.close()
        return account
    
    def update_role(self, account_id, state):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET state = %s WHERE id_user = %s", (state, account_id))
        conn.commit()
        conn.close()
 

    def get_account_by_email(self, email):
        conn = self._get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        account = cursor.fetchone()
        conn.close()
        return account

    def add_account(self, name, surname, email, hashed_password):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Users (Name, Surname, email, Password, state, Activate) VALUES (%s, %s, %s, %s, 'user', FALSE)",
            (name, surname, email, hashed_password)
        )
        conn.commit()
        account_id = cursor.lastrowid
        conn.close()
        return account_id

    def update_account(self, account_id, name, surname, email):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Users SET Name = %s, Surname = %s, email = %s WHERE id_user = %s",
            (name, surname, email, account_id)
        )
        conn.commit()
        conn.close()

    def update_password(self, account_id, hashed_password):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE Users SET Password = %s WHERE id_user = %s",
            (hashed_password, account_id)
        )
        conn.commit()
        conn.close()

    def delete_account(self, account_id):
        conn = self._get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Users WHERE id_user = %s", (account_id,))
        conn.commit()
        conn.close()