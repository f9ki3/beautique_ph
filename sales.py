from database import Database

class Sales(Database):
    def createProductTables(self):
        # Create Sales table for basic sale information
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS Sales (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subtotal REAL NOT NULL,
            vat REAL NOT NULL,
            total REAL NOT NULL,
            customer_id INTEGER NOT NULL,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL,
            address TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ''')

        # Create SalesItems table for product-specific details
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS SalesItems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sale_id INTEGER NOT NULL,
            category_name TEXT NOT NULL,
            imageSrc TEXT NOT NULL,
            max_stock INTEGER NOT NULL,
            price REAL NOT NULL,
            product_id INTEGER NOT NULL,
            product_name TEXT NOT NULL,
            qty INTEGER NOT NULL,
            selectedColor TEXT NOT NULL,
            selectedSize TEXT NOT NULL,
            FOREIGN KEY (sale_id) REFERENCES Sales(id) ON DELETE CASCADE
        );
        ''')
        self.commit()

    def insertSale(self, subtotal, vat, total, customer_id, first_name, last_name, email, address, items):
        # Insert the sale into the Sales table
        self.cursor.execute('''
        INSERT INTO Sales (subtotal, vat, total, customer_id, first_name, last_name, email, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        ''', (subtotal, vat, total, customer_id, first_name, last_name, email, address))

        # Get the last inserted sale ID
        sale_id = self.cursor.lastrowid

        # Insert each item into the SalesItems table
        for item in items:
            self.cursor.execute('''
            INSERT INTO SalesItems (sale_id, category_name, imageSrc, max_stock, price, product_id, product_name, qty, selectedColor, selectedSize)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            ''', (
                sale_id,
                item['category_name'],
                item['imageSrc'],
                item['max_stock'],
                item['price'],
                item['product_id'],
                item['product_name'],
                item['qty'],
                item['selectedColor'],
                item['selectedSize']
            ))

        self.commit()

    # Method to fetch all orders for a customer, including the items
    def get_all_orders(self, customer_id):
        query = 'SELECT * FROM Sales WHERE customer_id = ?'
        self.cursor.execute(query, (customer_id,))
        orders = self.cursor.fetchall()

        order_list = []
        for order in orders:
            # Get the products (items) related to this sale
            sale_id = order[0]
            self.cursor.execute('SELECT * FROM SalesItems WHERE sale_id = ?', (sale_id,))
            items = self.cursor.fetchall()

            # Format the items as a list of dictionaries
            item_list = []
            for item in items:
                item_list.append({
                    "category_name": item[2],
                    "imageSrc": item[3],
                    "max_stock": item[4],
                    "price": item[5],
                    "product_id": item[6],
                    "product_name": item[7],
                    "qty": item[8],
                    "selectedColor": item[9],
                    "selectedSize": item[10]
                })

            # Append the order with its related items
            order_list.append({
                "id": order[0],
                "subtotal": order[1],
                "vat": order[2],
                "total": order[3],
                "customer_id": order[4],
                "first_name": order[5],
                "last_name": order[6],
                "email": order[7],
                "address": order[8],
                "created_at": order[9],
                "items": item_list  # Attach the items to the order
            })

        order_list.reverse()
        return order_list

    def get_all_sales(self):
        try:
            query = 'SELECT * FROM Sales'
            self.cursor.execute(query)
            orders = self.cursor.fetchall()

            order_list = []
            for order in orders:
                # Get the products (items) related to this sale
                sale_id = order[0]
                self.cursor.execute('SELECT * FROM SalesItems WHERE sale_id = ?', (sale_id,))
                items = self.cursor.fetchall()

                # Format the items as a list of dictionaries
                item_list = []
                for item in items:
                    item_list.append({
                        "category_name": item[2],
                        "imageSrc": item[3],
                        "max_stock": item[4],
                        "price": item[5],
                        "product_id": item[6],
                        "product_name": item[7],
                        "qty": item[8],
                        "selectedColor": item[9],
                        "selectedSize": item[10]
                    })

                # Append the order with its related items
                order_list.append({
                    "id": order[0],
                    "subtotal": order[1],
                    "vat": order[2],
                    "total": order[3],
                    "customer_id": order[4],
                    "first_name": order[5],
                    "last_name": order[6],
                    "email": order[7],
                    "address": order[8],
                    "created_at": order[9],
                    "items": item_list
                })

            order_list.reverse()
            return order_list

        except Exception as e:
            print(f"An error occurred while fetching sales: {e}")
            return []

if __name__ == "__main__":
    sales = Sales()
    sales.createProductTables()
