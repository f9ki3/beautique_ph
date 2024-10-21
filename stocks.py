from database import *
from datetime import datetime

class Stocks(Database):
    def createStockTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            stock_product_id INTEGER,
            stock_date TEXT,
            stock_qty INTEGER,
            stock_type TEXT,
            FOREIGN KEY (stock_product_id) REFERENCES products(id) ON DELETE CASCADE
        );
        ''')
        self.commit()  # Commit the table creation

    def insertStock(self, stock_product_id, stock_qty, stock_type):
        stock_date = datetime.now().date()  # Get today's date
        # Insert the new stock record
        self.cursor.execute('''
            INSERT INTO stocks (stock_product_id, stock_date, stock_qty, stock_type)
            VALUES (?, ?, ?, ?)
        ''', (stock_product_id, stock_date, stock_qty, stock_type))
        
        # Update the stock quantity of the corresponding product
        self.cursor.execute('''
            UPDATE products
            SET stocks = stocks + ?
            WHERE id = ?
        ''', (stock_qty, stock_product_id))

        self.commit()
    
    def stockout(self, stock_product_id, stock_qty):
        stock_date = datetime.now().date()  # Get today's date
        stock_type = 'OUT'  # You can define the type of stock out if needed

        # Insert a new stock record for stock out
        self.cursor.execute('''
            INSERT INTO stocks (stock_product_id, stock_date, stock_qty, stock_type)
            VALUES (?, ?, ?, ?)
        ''', (stock_product_id, stock_date, stock_qty, stock_type))

        # Update the stock quantity of the corresponding product
        self.cursor.execute('''
            UPDATE products
            SET stocks = stocks - ?
            WHERE id = ? AND stocks >= ?  -- Ensure there is enough stock
        ''', (stock_qty, stock_product_id, stock_qty))

        self.commit()
        
    def update_product_stock(self, product_id, qty):
        self.cursor.execute('''
        UPDATE products
        SET stock = stock - ?
        WHERE id = ? AND stock >= ?;
        ''', (qty, product_id, qty))
        self.commit()

    def deleteStock(self, stock_id):
        self.cursor.execute('''
        DELETE FROM stocks
        WHERE id = ?
        ''', (stock_id,))
        self.commit()

    def fetchAllStocks(self):
        self.cursor.execute('''
            SELECT 
                s.id AS stock_id,
                s.stock_date,
                s.stock_qty,
                s.stock_type,
                p.id AS product_id,
                p.product_name,
                p.description,
                p.price,
                p.category_id,
                p.status
            FROM stocks s
            JOIN products p ON s.stock_product_id = p.id
        ''')
        
        rows = self.cursor.fetchall()
        
        # Convert each row to a dictionary
        return [dict(row) for row in rows]



if __name__ == "__main__":
    # Example usage
    stocks = Stocks()
    stocks.createStockTable()

    # Insert some sample stock entries
    stocks_to_insert = [
        (14, 100, 'IN'),  # Product ID 1, quantity 100, stock type 'IN'
        (15, 50, 'OUT'),  # Product ID 2, quantity 50, stock type 'OUT'
        (16, 200, 'IN')  # Product ID 3, quantity 200, stock type 'IN'
    ]

    for stock in stocks_to_insert:
        stocks.insertStock(*stock)

    all_stocks = stocks.fetchAllStocks()
    print(all_stocks)
    stocks.close()  # Close the database connection
