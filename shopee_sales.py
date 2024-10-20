from database import Database

class ShopeeSales(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS shopee_sales (
            order_id INTEGER PRIMARY KEY,  -- Assuming Order ID is unique and can serve as the primary key
            order_status TEXT NOT NULL,
            tracking_number TEXT,  -- Tracking number is optional, hence it doesn't require NOT NULL
            shipping_option TEXT NOT NULL,
            shipment_method TEXT NOT NULL,
            estimated_ship_out_date TEXT,  -- Storing dates as TEXT in SQLite for flexibility
            ship_time TEXT,
            order_creation_date TEXT NOT NULL,
            order_paid_time TEXT,
            product_name TEXT NOT NULL,
            variation_name TEXT,
            original_price REAL NOT NULL,  -- Using REAL for prices to handle decimals
            deal_price REAL NOT NULL,
            quantity INTEGER NOT NULL
        );
        ''')
        self.commit()