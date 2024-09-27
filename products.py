from database import Database

class Product(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT,
            category_id INTEGER,
            stocks INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            product_image TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
        ''')
        self.commit()

    def insertProduct(self, product_name, category_id, stocks, status, product_image):
        self.cursor.execute('''
        INSERT INTO products (product_name, category_id, stocks, status, product_image)
        VALUES (?, ?, ?, ?, ?)
        ''', (product_name, category_id, stocks, status, product_image))
        self.commit()

    def updateProduct(self, product_id, product_name, category_id, stocks, status, product_image):
        self.cursor.execute('''
        UPDATE products
        SET product_name = ?, category_id = ?, stocks = ?, status = ?, product_image = ?
        WHERE id = ?
        ''', (product_name, category_id, stocks, status, product_image, product_id))
        self.commit()

    def deleteProduct(self, product_id):
        self.cursor.execute('''
        DELETE FROM products
        WHERE id = ?
        ''', (product_id,))
        self.commit()

    def fetchAllProducts(self):
        self.cursor.execute('SELECT * FROM products')
        rows = self.cursor.fetchall()
        return [dict(row) for row in rows]

if __name__ == "__main__":
    # Example usage can be added here if necessary
    pass