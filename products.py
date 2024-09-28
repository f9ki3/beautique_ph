from database import Database

class Product(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT,
            category_id INTEGER,
            stocks INTEGER DEFAULT 0,
            price REAL,  -- Added price column
            description TEXT,  -- Added description column
            status TEXT DEFAULT 'active',
            product_image TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        )
        ''')
        self.commit()

    def insertProduct(self, product_name, category_id, stocks, price, description, status, product_image):
        self.cursor.execute('''
        INSERT INTO products (product_name, category_id, stocks, price, description, status, product_image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (product_name, category_id, stocks, price, description, status, product_image))
        self.commit()

    def updateProduct(self, product_id, product_name, category_id, stocks, price, description, status, product_image):
        self.cursor.execute('''
        UPDATE products
        SET product_name = ?, category_id = ?, stocks = ?, price = ?, description = ?, status = ?, product_image = ?
        WHERE id = ?
        ''', (product_name, category_id, stocks, price, description, status, product_image, product_id))
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

    # def insertSampleData(self):
    #     sample_products = [
    #         ('Laptop', 1, 10, 999.99, 'High-performance laptop for gaming and work.', 'active', 'images/laptop.png'),
    #         ('Smartphone', 2, 20, 499.99, 'Latest model smartphone with cutting-edge features.', 'active', 'images/smartphone.png'),
    #         ('Headphones', 3, 50, 199.99, 'Noise-cancelling headphones for an immersive experience.', 'active', 'images/headphones.png'),
    #         ('Smartwatch', 2, 30, 249.99, 'Smartwatch with health tracking and notifications.', 'inactive', 'images/smartwatch.png'),
    #         ('Tablet', 1, 15, 299.99, 'Portable tablet for browsing and entertainment.', 'active', 'images/tablet.png')
    #     ]
        
    #     for product in sample_products:
    #         self.insertProduct(*product)

if __name__ == "__main__":
    product_db = Product()
    product_db.createProductTable()
    all_products = product_db.fetchAllProducts()
    print(all_products)  # Print all products to verify insertion
