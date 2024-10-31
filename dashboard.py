from database import Database
import sqlite3
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder
from mlxtend.frequent_patterns import apriori, association_rules
import json

class Dashboards(Database):
    def get_accounts_count(self):
        # Get admin account count
        self.cursor.execute('''
        SELECT COUNT(admin_id) FROM admin_account;
        ''')
        admin_count = self.cursor.fetchone()[0]  # Fetch the first row, first column (count)
        
        # Get customer account count
        self.cursor.execute('''
        SELECT COUNT(customer_id) FROM customer_account;
        ''')
        customer_count = self.cursor.fetchone()[0]  # Fetch the first row, first column (count)
        
        # Execute the SQL query to get the sum of today's sales
        self.cursor.execute('''
        SELECT SUM(total) AS total_sum
        FROM Sales
        WHERE DATE(created_at) = DATE('now');
        ''')
        total_sales_today = self.cursor.fetchone()[0]  # Fetch the first row, first column (total_sum)
        
        # Handle the case where there are no sales for the day (None result)
        if total_sales_today is None:
            total_sales_today = 0.0  # Set to 0 if there are no sales

        # Execute the SQL query to get the sum of sales for the current month
        self.cursor.execute('''
        SELECT SUM(total) AS total_sum
        FROM Sales
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now');
        ''')
        total_sales_month = self.cursor.fetchone()[0]  # Fetch the first row, first column (total_sum)

        # Handle the case where there are no sales for the month (None result)
        if total_sales_month is None:
            total_sales_month = 0.0  # Set to 0 if there are no sales

        return {
            'admin_count': admin_count,
            'customer_count': customer_count,
            'total_sales_today': total_sales_today,
            'total_sales_month': total_sales_month
        }

    def get_sales_data(self):
        # Execute the SQL query to get daily sales data from 'Sales' table
        self.cursor.execute('''
        SELECT DATE(created_at) AS date, SUM(total) AS sum
        FROM Sales
        GROUP BY DATE(created_at);
        ''')
        daily_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for daily dates and sums (Sales)
        daily_dates = []
        daily_sums = []

        # Populate the daily lists (Sales)
        for row in daily_sales:
            daily_dates.append(row[0])  # Add the date
            daily_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Execute the SQL query to get monthly sales data from 'Sales' table
        self.cursor.execute('''
        SELECT strftime('%Y-%m', created_at) AS month, SUM(total) AS sum
        FROM Sales
        GROUP BY strftime('%Y-%m', created_at);
        ''')
        monthly_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for monthly months and sums (Sales)
        monthly_months = []
        monthly_sums = []

        # Populate the monthly lists (Sales)
        for row in monthly_sales:
            monthly_months.append(row[0])  # Add the month
            monthly_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Execute the SQL query to get yearly sales data from 'Sales' table
        self.cursor.execute('''
        SELECT strftime('%Y', created_at) AS year, SUM(total) AS sum
        FROM Sales
        GROUP BY strftime('%Y', created_at);
        ''')
        yearly_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for yearly years and sums (Sales)
        yearly_years = []
        yearly_sums = []

        # Populate the yearly lists (Sales)
        for row in yearly_sales:
            yearly_years.append(row[0])  # Add the year
            yearly_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Query daily sales data from 'shopee_sales' table
        self.cursor.execute('''
        SELECT DATE(order_creation_date) AS date, SUM(deal_price * quantity) AS sum
        FROM shopee_sales
        GROUP BY DATE(order_creation_date);
        ''')
        shopee_daily_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for daily dates and sums (Shopee Sales)
        shopee_daily_dates = []
        shopee_daily_sums = []

        # Populate the daily lists (Shopee Sales)
        for row in shopee_daily_sales:
            shopee_daily_dates.append(row[0])  # Add the date
            shopee_daily_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Query monthly sales data from 'shopee_sales' table
        self.cursor.execute('''
        SELECT strftime('%Y-%m', order_creation_date) AS month, SUM(deal_price * quantity) AS sum
        FROM shopee_sales
        GROUP BY strftime('%Y-%m', order_creation_date);
        ''')
        shopee_monthly_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for monthly months and sums (Shopee Sales)
        shopee_monthly_months = []
        shopee_monthly_sums = []

        # Populate the monthly lists (Shopee Sales)
        for row in shopee_monthly_sales:
            shopee_monthly_months.append(row[0])  # Add the month
            shopee_monthly_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Query yearly sales data from 'shopee_sales' table
        self.cursor.execute('''
        SELECT strftime('%Y', order_creation_date) AS year, SUM(deal_price * quantity) AS sum
        FROM shopee_sales
        GROUP BY strftime('%Y', order_creation_date);
        ''')
        shopee_yearly_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for yearly years and sums (Shopee Sales)
        shopee_yearly_years = []
        shopee_yearly_sums = []

        # Populate the yearly lists (Shopee Sales)
        for row in shopee_yearly_sales:
            shopee_yearly_years.append(row[0])  # Add the year
            shopee_yearly_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Return the result in the specified format
        return [
            {
                "store_daily_sales": {
                    "date": daily_dates,
                    "sum": daily_sums
                }
            },
            {
                "store_monthly_sales": {
                    "month": monthly_months,
                    "sum": monthly_sums
                }
            },
            {
                "store_yearly_sales": {
                    "year": yearly_years,
                    "sum": yearly_sums
                }
            },
            {
                "shopee_daily_sales": {
                    "date": shopee_daily_dates,
                    "sum": shopee_daily_sums
                }
            },
            {
                "shopee_monthly_sales": {
                    "month": shopee_monthly_months,
                    "sum": shopee_monthly_sums
                }
            },
            {
                "shopee_yearly_sales": {
                    "year": shopee_yearly_years,
                    "sum": shopee_yearly_sums
                }
            }
        ]

    
    def get_products_sales(self):
        # Execute the SQL query to get the top 10 Shopee products
        self.cursor.execute('''
        SELECT product_name, SUM(quantity) AS total_quantity
        FROM shopee_sales
        WHERE product_name NOT LIKE '%CHECKOUT LINK (1-30 PCS%'
        AND product_name NOT LIKE '%FREEBIES FOR BUYERS ONLY%'
        GROUP BY product_name
        ORDER BY total_quantity DESC
        LIMIT 10;
        ''')
        shopee_top_results = self.cursor.fetchall()  # Fetch all results for top Shopee products

        # Convert results into a list of dictionaries for better readability
        shopee_top_products = [{"product_name": row[0], "total_quantity": row[1]} for row in shopee_top_results]

        # Execute the SQL query to get the bottom 10 Shopee products
        self.cursor.execute('''
        SELECT product_name, SUM(quantity) AS total_quantity
        FROM shopee_sales
        WHERE product_name NOT LIKE '%CHECKOUT LINK (1-30 PCS%'
        AND product_name NOT LIKE '%FREEBIES FOR BUYERS ONLY%'
        GROUP BY product_name
        ORDER BY total_quantity ASC
        LIMIT 10;
        ''')
        shopee_bottom_results = self.cursor.fetchall()  # Fetch all results for bottom Shopee products

        # Convert results into a list of dictionaries for better readability
        shopee_bottom_products = [{"product_name": row[0], "total_quantity": row[1]} for row in shopee_bottom_results]

        # Execute the SQL query to get the top 10 store products
        self.cursor.execute('''
        SELECT product_name, SUM(qty) AS total_quantity
        FROM SalesItems
        WHERE product_name NOT LIKE '%CHECKOUT LINK (1-30 PCS%'
        AND product_name NOT LIKE '%FREEBIES FOR BUYERS ONLY%'
        GROUP BY product_name
        ORDER BY total_quantity DESC
        LIMIT 5;
        ''')
        store_top_results = self.cursor.fetchall()  # Fetch all results for top store products

        # Convert results into a list of dictionaries for better readability
        store_top_products = [{"product_name": row[0], "total_quantity": row[1]} for row in store_top_results]

        # Execute the SQL query to get the bottom 10 store products
        self.cursor.execute('''
        SELECT product_name, SUM(qty) AS total_quantity
        FROM SalesItems
        WHERE product_name NOT LIKE '%CHECKOUT LINK (1-30 PCS%'
        AND product_name NOT LIKE '%FREEBIES FOR BUYERS ONLY%'
        GROUP BY product_name
        ORDER BY total_quantity ASC
        LIMIT 5;
        ''')
        store_bottom_results = self.cursor.fetchall()  # Fetch all results for bottom store products

        # Convert results into a list of dictionaries for better readability
        store_bottom_products = [{"product_name": row[0], "total_quantity": row[1]} for row in store_bottom_results]

        # Return a dictionary with all 4 sets of products
        return {
            'shopee_top_products': shopee_top_products,
            'shopee_bottom_products': shopee_bottom_products,
            'store_top_products': store_top_products,
            'store_bottom_products': store_bottom_products
        }

    def get_aprio(self):
        # Connect to SQLite database and fetch transaction data
        conn = sqlite3.connect('beautique.db')
        cursor = conn.cursor()
        cursor.execute("SELECT items FROM association")
        transactions = cursor.fetchall()
        conn.close()

        # Convert transaction data to list of lists
        transaction_list = [transaction[0].split(', ') for transaction in transactions]

        # Check if transaction_list is non-empty
        result = {}
        if not transaction_list:
            result["message"] = "No transactions found in the dataset. Ensure the database contains transaction data."
        else:
            # Transaction encoding
            te = TransactionEncoder()
            te_data = te.fit(transaction_list).transform(transaction_list)
            df = pd.DataFrame(te_data, columns=te.columns_)

            # Apply Apriori algorithm to find frequent itemsets with min support of 0.1
            frequent_itemsets = apriori(df, min_support=0.1, use_colnames=True)

            # Check if any frequent itemsets were found
            if frequent_itemsets.empty:
                result["message"] = "No frequent itemsets found. Try lowering the min_support or verify the data."
            else:
                # Generate association rules with confidence and lift
                rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

                # Check if any association rules were generated
                if rules.empty:
                    result["message"] = "No association rules generated. Try lowering the confidence threshold or checking data quality."
                else:
                    # Convert rules to JSON-like format, limiting to first 30 rules
                    rules_list = []
                    for _, row in rules.head(30).iterrows():  # Limit to the first 30 rules
                        rules_list.append({
                            "antecedents": list(row["antecedents"]),
                            "consequents": list(row["consequents"]),
                            "support": row["support"],
                            "confidence": row["confidence"],
                            "lift": row["lift"]
                        })
                    result["association_rules"] = rules_list

        # Convert the result to JSON
        result_json = json.dumps(result, indent=4)
        return result


    def get_aprio_store(self):
        # Connect to SQLite database and fetch transaction data
        conn = sqlite3.connect('beautique.db')
        cursor = conn.cursor()
        cursor.execute("SELECT items FROM association_store LIMIT 30")
        transactions = cursor.fetchall()
        conn.close()

        # Convert transaction data to list of lists
        transaction_list = [transaction[0].split(', ') for transaction in transactions]

        # Check if transaction_list is non-empty
        result = {}
        if not transaction_list:
            result["message"] = "No transactions found in the dataset. Ensure the database contains transaction data."
        else:
            # Transaction encoding
            te = TransactionEncoder()
            te_data = te.fit(transaction_list).transform(transaction_list)
            df = pd.DataFrame(te_data, columns=te.columns_)

            # Apply Apriori algorithm to find frequent itemsets with min support of 0.1
            frequent_itemsets = apriori(df, min_support=0.1, use_colnames=True)

            # Check if any frequent itemsets were found
            if frequent_itemsets.empty:
                result["message"] = "No frequent itemsets found. Try lowering the min_support or verify the data."
            else:
                # Generate association rules with confidence and lift
                rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=0.1)

                # Check if any association rules were generated
                if rules.empty:
                    result["message"] = "No association rules generated. Try lowering the confidence threshold or checking data quality."
                else:
                    # Convert rules to JSON-like format, limiting to first 30 rules
                    rules_list = []
                    for _, row in rules.head(30).iterrows():  # Limit to the first 30 rules
                        rules_list.append({
                            "antecedents": list(row["antecedents"]),
                            "consequents": list(row["consequents"]),
                            "support": row["support"],
                            "confidence": row["confidence"],
                            "lift": row["lift"]
                        })
                    result["association_rules"] = rules_list

        # Convert the result to JSON
        result_json = json.dumps(result, indent=4)
        return result

