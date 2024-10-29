import csv
from database import Database

class ShopeeSales(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS shopee_sales (
            order_id TEXT PRIMARY KEY,
            order_status TEXT,
            tracking_number TEXT,
            shipping_option TEXT,
            shipment_method TEXT,
            estimated_ship_out_date TEXT,
            ship_time TEXT,
            order_creation_date TEXT,
            order_paid_time TEXT,
            product_name TEXT,
            variation_name TEXT,
            original_price REAL,
            deal_price REAL,
            quantity INTEGER
        );
        ''')
        self.commit()

    def upload_csv_sql(self, csv_file_path):
        # Open the CSV file
        with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
            # Read the CSV file using DictReader to map column names to values
            reader = csv.DictReader(csvfile)
            
            # Prepare the SQL insert query
            insert_query = '''
            INSERT OR IGNORE INTO shopee_sales (
                order_id, order_status, tracking_number, shipping_option, 
                shipment_method, estimated_ship_out_date, ship_time, 
                order_creation_date, order_paid_time, product_name, 
                variation_name, original_price, deal_price, quantity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            '''
            
            # Insert each row from the CSV into the table
            for row in reader:
                self.cursor.execute(insert_query, (
                    row['Order ID'], row['Order Status'], row['Tracking Number*'],
                    row['Shipping Option'], row['Shipment Method'], row['Estimated Ship Out Date'],
                    row['Ship Time'], row['Order Creation Date'], row['Order Paid Time'],
                    row['Product Name'], row['Variation Name'], row['Original Price'],
                    row['Deal Price'], row['Quantity']
                ))

            # Commit the transaction
            self.commit()

    def fetchShopeeSales(self):
        # Query to fetch all sales data
        self.cursor.execute("SELECT * FROM shopee_sales")
        rows = self.cursor.fetchall()

        # Convert rows to a list of dictionaries
        sales_data = []
        columns = [column[0] for column in self.cursor.description]  # Get column names

        for row in rows:
            sales_data.append(dict(zip(columns, row)))  # Create a dict for each row

        return sales_data  # Return the list of dictionaries
    
    def exportShopeeSales(self, filename="shopee_sales_export.csv"):
        # Query to fetch all sales data
        self.cursor.execute("SELECT * FROM shopee_sales")
        rows = self.cursor.fetchall()

        # Get column names from cursor description
        columns = [column[0] for column in self.cursor.description]

        # Write to CSV
        with open(filename, mode='w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(columns)  # Write the column headers
            writer.writerows(rows)    # Write the rows

        print(f"Data exported to {filename}")

if __name__ == "__main__":
    db = ShopeeSales()
    db.createProductTable()
#     db.upload_csv_sql("static/uploads/CLEANED_JUNE_2023.xlsx_-_Cleaned_Data.csv")
