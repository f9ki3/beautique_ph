import sqlite3
import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules

class Database:
    def __init__(self, db_name='beautique.db'):
        self.conn = sqlite3.connect(db_name)
        self.conn.row_factory = sqlite3.Row  # Set the row factory for dictionary-like rows
        self.cursor = self.conn.cursor()

    def commit(self):
        self.conn.commit()

    def close(self):
        self.conn.close()

class ShopeeSales(Database):
    def createProductTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS shopee_sales (
            order_id TEXT,
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
            quantity INTEGER,
            PRIMARY KEY(order_id, product_name)  -- Assuming order_id and product_name together are unique
        );
        ''')
        self.commit()
    
    def load_sales_data(self):
        # Load sales data from the database into a DataFrame
        query = "SELECT * FROM shopee_sales"
        df = pd.read_sql_query(query, self.conn)  # Use self.conn for queries
        
        # Rename columns to match expected names
        # Make sure to include 'quantity' as 'Quantity' since that's how it is in the database
        df.rename(columns={
            'tracking_number': 'tracking_number',
            'shipping_option': 'shipping_option',
            'shipment_method': 'shipment_method',
            'estimated_ship_out_date': 'estimated_ship_out_date',
            'ship_time': 'ship_time',
            'order_creation_date': 'order_creation_date',
            'order_paid_time': 'order_paid_time',
            'variation_name': 'variation_name',
            'original_price': 'original_price',
            'deal_price': 'deal_price',
            'quantity': 'quantity'
        }, inplace=True)
        
        print(df.head())  # Print the first few rows of the DataFrame
        print(df.columns)  # Print the column names to verify
        return df

    def generate_frequent_itemsets(self, df, min_support=0.01):
        # Create a basket for each order
        basket = (df.groupby(['order_id', 'product_name'])['quantity']
                .sum().unstack().reset_index().fillna(0)
                .set_index('order_id'))
        
        # Check the basket DataFrame
        print("Basket DataFrame:")
        print(basket.head())  # Print the first few rows of the basket to debug

        # Convert quantities to 1s and 0s using mask
        basket = basket.mask(basket > 0, 1).fillna(0)

        # Generate frequent itemsets using the Apriori algorithm
        frequent_itemsets = apriori(basket, min_support=min_support, use_colnames=True)
        
        # Check the frequent itemsets DataFrame
        print("Frequent Itemsets:")
        print(frequent_itemsets)  # Print to check if itemsets were generated

        return frequent_itemsets


    def create_association_rules(self, frequent_itemsets, min_confidence=0.5):
        # Generate association rules from the frequent itemsets
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)
        return rules

# Example usage
if __name__ == "__main__":
    sales = ShopeeSales()  # Create an instance of ShopeeSales
    sales.createProductTable()  # Create the table if it doesn't exist

    sales_data = sales.load_sales_data()  # Load sales data
    frequent_itemsets = sales.generate_frequent_itemsets(sales_data, min_support=0.01)  # Generate frequent itemsets
    rules = sales.create_association_rules(frequent_itemsets, min_confidence=0.5)  # Create association rules

    print(rules)  # Print the generated rules

    # Close the database connection when done
    sales.close()

# import pandas as pd

# # Sample DataFrames for popular and unpopular products
# popular_products = pd.DataFrame({
#     'Rank': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
#     'Product Name': [
#         'ZARA TWEED COORDINATES (SKIRT & SHORTS TERNO)',
#         'FREEBIES FOR BUYERS ONLY',
#         'BARBARA RUFFLE SLEEVES TOP BARK CREPE FABRIC',
#         'TWEED COORDS/DRESS CHECKOUT (5 sets)',
#         'ZARA TWEED COORDINATES (SKIRT & SHORTS TERNO) - NEW COLORS',
#         'GANNI DUPE RUCHED RIBBON TOP || beautique.ph',
#         'FREEBIES FOR BUYERS ONLY (2)',
#         'TWEED COORDS/DRESS CHECKOUT (16-25 sets)',
#         'ZARA STRAPPY TOP KNITTED',
#         'ZARA KNITTED TUBE TOP'
#     ],
#     'Number of Sales': [1966, 523, 501, 401, 327, 195, 148, 126, 76, 42],
#     'Stars': [None] * 10  # Placeholder for star ratings if available
# })

# unpopular_products = pd.DataFrame({
#     'Rank': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
#     'Product Name': [
#         '1 ML ANNEY PERFUME TESTER',
#         'ANNEY PERFUME (JENNY T)',
#         'ANNEY PERFUME 115ML DAKS SIZE RESELLER BUNDLE',
#         'ASSORTED ITEMS Checkout (GWENDOLINE KATE)',
#         'ASSORTED ITEMS Checkout (WELLA MAE)',
#         'ASSORTED SKIRT BUNDLE',
#         'ASSORTED TOPS (ANDRIA MAE PAZ)',
#         'ASSORTED TOPS (ANDRIA PAZ)',
#         'ASSORTED TOPS (HAJEE CADZ)',
#         'ASSORTED TOPS (INDIEXCLOSET)'
#     ],
#     'Number of Sales': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
#     'Stars': [None] * 10  # Placeholder for star ratings if available
# })


# import matplotlib.pyplot as plt

# # Popular Products Bar Chart
# plt.figure(figsize=(10, 5))
# plt.bar(popular_products['Product Name'], popular_products['Number of Sales'], color='green')
# plt.xticks(rotation=45, ha='right')
# plt.title('Sales of Popular Products')
# plt.ylabel('Number of Sales')
# plt.xlabel('Product Name')
# plt.tight_layout()
# plt.show()

# # Unpopular Products Bar Chart
# plt.figure(figsize=(10, 5))
# plt.bar(unpopular_products['Product Name'], unpopular_products['Number of Sales'], color='red')
# plt.xticks(rotation=45, ha='right')
# plt.title('Sales of Unpopular Products')
# plt.ylabel('Number of Sales')
# plt.xlabel('Product Name')
# plt.tight_layout()
# plt.show()
