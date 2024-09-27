class Products(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
        ''')
        self.commit()

    def insertProduct(self, product_name, category_id):
        self.cursor.execute('''
        INSERT INTO products (product_name, category_id)
        VALUES (?, ?)
        ''', (product_name, category_id))
        self.commit()

    def updateProduct(self, product_id, product_name, category_id):
        self.cursor.execute('''
        UPDATE products
        SET product_name = ?, category_id = ?
        WHERE id = ?
        ''', (product_name, category_id, product_id))
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
    