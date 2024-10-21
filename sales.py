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

    # Method to fetch a specific order by its ID
    def get_all_orders(self, customer_id):
        # Select all orders for the specified customer_id
        query = 'SELECT * FROM Sales WHERE customer_id = ?'
        self.cursor.execute(query, (customer_id,))
        orders = self.cursor.fetchall()  # Fetch all orders for the customer

        # Format the result as a list of dictionaries
        order_list = []
        for order in orders:
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
                "cart_items": order[9],
                "created_at": order[10]
            })

        # Reverse the order list
        order_list.reverse()

        return order_list  # Return the list of orders in reversed order
    
    def get_all_sales(self):
        try:
            # Select all orders from the Sales table
            query = 'SELECT * FROM Sales'
            self.cursor.execute(query)
            orders = self.cursor.fetchall()  # Fetch all orders

            # Format the result as a list of dictionaries
            order_list = []
            for order in orders:
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
                    "cart_items": order[9],
                    "created_at": order[10]
                })

            # Reverse the order list
            order_list.reverse()

            return order_list  # Return the list of orders in reversed order

        except Exception as e:
            print(f"An error occurred while fetching sales: {e}")
            return []  # Return an empty list in case of an error





# if __name__ == "__main__":
#     sales = Sales()
#     sales.createProductTable()