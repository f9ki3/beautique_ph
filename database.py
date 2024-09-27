import sqlite3

class Database:
    def __init__(self, db_name='beautique.db'):
        self.conn = sqlite3.connect(db_name)
        self.conn.row_factory = sqlite3.Row  # Set the row factory for dictionary-like rows
        self.cursor = self.conn.cursor()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()