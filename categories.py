from database import *
from datetime import datetime

class Categories(Database):
    def createCategoryTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_date TEXT,
            category_name TEXT
        )
        ''')
        self.commit()  # Commit the table creation

    def insertCategory(self, category_name):
        category_date = datetime.now().date()  # Get today's date
        self.cursor.execute('''
        INSERT INTO categories (category_date, category_name)
        VALUES (?, ?)
        ''', (category_date, category_name))
        self.commit()

    def updateCategory(self, category_id, category_date, category_name):
        self.cursor.execute('''
        UPDATE categories
        SET category_date = ?, category_name = ?
        WHERE id = ?
        ''', (category_date, category_name, category_id))
        self.commit()

    def deleteCategory(self, category_id):
        self.cursor.execute('''
        DELETE FROM categories
        WHERE id = ?
        ''', (category_id,))
        self.commit()

    def fetchAllCategories(self):
        self.cursor.execute('SELECT * FROM categories')
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows]  # Convert each row to a dictionary

if __name__ == "__main__":
    # Example usage
    categories = Categories()
    categories.createCategoryTable()
    categories_to_insert = [
        'Tops',
        'Bottoms',
        'Outer Wear',
        'Head Wear',
        'Foot Wear',
        'Eye Wear'
    ]

    for category in categories_to_insert:
        categories.insertCategory('2023-09-27', category)

    all_categories = categories.fetchAllCategories()
    print(all_categories)
    categories.close()  # Close the database connection
