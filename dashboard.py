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

    def get_daily_sales_data(self):
        # Execute the SQL query to get daily sales data
        self.cursor.execute('''
        SELECT DATE(created_at) AS date, SUM(total) AS sum
        FROM Sales
        GROUP BY DATE(created_at);
        ''')
        daily_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for daily dates and sums
        daily_dates = []
        daily_sums = []

        # Populate the daily lists
        for row in daily_sales:
            daily_dates.append(row[0])  # Add the date
            daily_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Execute the SQL query to get monthly sales data
        self.cursor.execute('''
        SELECT strftime('%Y-%m', created_at) AS month, SUM(total) AS sum
        FROM Sales
        GROUP BY strftime('%Y-%m', created_at);
        ''')
        monthly_sales = self.cursor.fetchall()  # Fetch all rows

        # Initialize lists for monthly months and sums
        monthly_months = []
        monthly_sums = []

        # Populate the monthly lists
        for row in monthly_sales:
            monthly_months.append(row[0])  # Add the month
            monthly_sums.append(row[1] if row[1] is not None else 0.0)  # Add the sum, defaulting to 0.0 if None

        # Return the result in the specified format
        return [
            {
                "daily_sales": {
                    "date": daily_dates,
                    "sum": daily_sums
                }
            },
            {
                "monthly_sales": {
                    "month": monthly_months,
                    "sum": monthly_sums
                }
            }
        ]



