from database import Database

class Sales(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE Sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subtotal REAL NOT NULL,
            vat REAL NOT NULL,
            total REAL NOT NULL,
            customer_id INTEGER NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            address TEXT NOT NULL,
            cart_items TEXT NOT NULL,  -- JSON or serialized format for cart items
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')
        self.commit()

    def insertSale(self, subtotal, vat, total, customer_id, first_name, last_name, email, address, cart_items):
        self.cursor.execute('''
        INSERT INTO Sales (subtotal, vat, total, customer_id, first_name, last_name, email, address, cart_items)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        ''', (subtotal, vat, total, customer_id, first_name, last_name, email, address, cart_items))
        self.commit()

if __name__ == "__main__":
    sales = Sales()
    sales.createProductTable()