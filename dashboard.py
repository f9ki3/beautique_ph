from database import Database

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

