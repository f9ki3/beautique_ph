import hashlib, json
from database import *

class Accounts(Database):
    def create_admin_account_table(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS admin_account (
                admin_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                full_name TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        self.conn.commit()  # Commit table creation 

    def create_admin_account(self, username, password, email, full_name):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        try:
            self.cursor.execute('''
                INSERT INTO admin_account (username, password, email, full_name)
                VALUES (?, ?, ?, ?)
            ''', (username, hashed_password, email, full_name))
            self.conn.commit()
            print("Account created successfully")
        except sqlite3.Error as e:
            print("Error creating account:", e)

    def login_admin_account(self, username, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        self.cursor.execute('''
            SELECT COUNT(*) FROM admin_account
            WHERE username = ? AND password = ?
        ''', (username, hashed_password))

        result = self.cursor.fetchone()
        return result[0] > 0  # Return True for success, False for failure

    def searchAccountSession(self, username, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Query to get all relevant account information
        cursor = self.cursor.execute('''
            SELECT * FROM admin_account
            WHERE username = ? AND password = ?
        ''', (username, hashed_password))
        
        result = cursor.fetchone()

        # Prepare the response data
        if result:
            # Assuming the columns in the admin_account table are: admin_id, username, password, email, full_name, created_at
            response_data = {
                'success': True,
                'account': {
                    'admin_id': result[0],
                    'username': result[1],
                    'email': result[3],
                    'full_name': result[4],
                    'created_at': result[5]
                }
            }
        else:
            response_data = {
                'success': False,
                'message': 'Login failed'
            }
        
        # Return the response as JSON
        return json.dumps(response_data)

    def fetchAllAdmins(self):
        # Fetch all admin accounts from the accounts table
        self.cursor.execute('''
            SELECT * FROM admin_account
        ''')
        
        results = self.cursor.fetchall()

        if results:
            admins = []
            for result in results:
                admin_data = {
                    'admin_id': result[0],
                    'username': result[1],
                    'email': result[3],
                    'full_name': result[4],
                    'created_at': result[5]
                }
                admins.append(admin_data)
            
            response_data = {
                'success': True,
                'admins': admins
            }
        else:
            response_data = {
                'success': False,
                'message': 'No admins found'
            }

        # Return the response data as a dictionary
        return response_data

    def delete_admin_account(self, customer_id):
        try:
            self.cursor.execute('DELETE FROM admin_account WHERE admin_id = ?', (customer_id,))
            self.conn.commit()  # Commit the delete operation
            print(f"Customer with ID {customer_id} has been deleted successfully.")
        except sqlite3.Error as e:
            print(f"An error occurred while deleting the customer: {e}")


if __name__ == "__main__":
    accounts = Accounts()
    accounts.create_admin_account_table()
    accounts.create_admin_account('admin', 'admin', 'admin@gmail.com', 'Juan Dela Cruz')
    accounts.close()  # Close the database connection when done
