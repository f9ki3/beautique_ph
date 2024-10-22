import hashlib
import json
from database import *

class Customer(Database):
    def create_customer_account_table(self):
        self.cursor.execute('''
            CREATE TABLE IF NOT EXISTS customer_account (
                customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                first_name TEXT,
                last_name TEXT,
                contact_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        self.conn.commit()  # Commit table creation
    
    def update_customer_account(self, customer_id, username=None, password=None, email=None, first_name=None, last_name=None, contact_address=None):
        # Start building the SQL UPDATE statement
        sql = 'UPDATE customer_account SET'
        params = []

        # Append updates to the SQL query and parameters list
        if username is not None:
            sql += ' username = ?,'
            params.append(username)
        if password is not None:
            sql += ' password = ?,'
            params.append(password)
        if email is not None:
            sql += ' email = ?,'
            params.append(email)
        if first_name is not None:
            sql += ' first_name = ?,'
            params.append(first_name)
        if last_name is not None:
            sql += ' last_name = ?,'
            params.append(last_name)
        if contact_address is not None:
            sql += ' contact_address = ?,'
            params.append(contact_address)

        # Remove the last comma and add the WHERE clause
        sql = sql.rstrip(',') + ' WHERE customer_id = ?'
        params.append(customer_id)

        # Execute the SQL statement
        self.cursor.execute(sql, params)
        self.conn.commit()  # Commit the changes


    def create_customer_account(self, username, password, email, first_name, last_name, contact_address):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        try:
            self.cursor.execute('''
                INSERT INTO customer_account (username, password, email, first_name, last_name, contact_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (username, hashed_password, email, first_name, last_name, contact_address))
            self.conn.commit()
            print("Account created successfully")
        except sqlite3.Error as e:
            print("Error creating account:", e)

    def login_customer_account(self, username, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        self.cursor.execute('''
            SELECT COUNT(*) FROM customer_account
            WHERE username = ? AND password = ?
        ''', (username, hashed_password))

        result = self.cursor.fetchone()
        return result[0] > 0  # Return True for success, False for failure

    def searchAccountSession(self, username, password):
        hashed_password = hashlib.sha256(password.encode()).hexdigest()
        
        # Query to get all relevant account information
        cursor = self.cursor.execute('''
            SELECT * FROM customer_account
            WHERE username = ? AND password = ?
        ''', (username, hashed_password))
        
        result = cursor.fetchone()

        # Prepare the response data
        if result:
            # Assuming the columns in the customer_account table are: customer_id, username, password, email, first_name, last_name, contact_address, created_at
            response_data = {
                'success': True,
                'account': {
                    'customer_id': result[0],
                    'username': result[1],
                    'email': result[3],
                    'first_name': result[4],
                    'last_name': result[5],
                    'contact_address': result[6],
                    'created_at': result[7]
                }
            }
        else:
            response_data = {
                'success': False,
                'message': 'Login failed'
            }
        
        # Return the response as JSON
        return json.dumps(response_data)
    
    def fetchCustomerOne(self, customer_id):
        # Fetch a single customer based on customer_id
        self.cursor.execute('''
            SELECT * FROM customer_account WHERE customer_id = ?
        ''', (customer_id,))
        
        result = self.cursor.fetchone()

        if result:
            response_data = {
                'success': True,
                'customer': {
                    'customer_id': result[0],
                    'username': result[1],
                    'email': result[3],
                    'first_name': result[4],
                    'last_name': result[5],
                    'contact_address': result[6],
                    'created_at': result[7]
                }
            }
        else:
            response_data = {
                'success': False,
                'message': 'Customer not found'
            }

        # Return the response data as a dictionary
        return response_data
    
    def fetchAllCustomers(self):
        # Fetch all customer accounts from the customer_account table
        self.cursor.execute('''
            SELECT * FROM customer_account
        ''')
        
        results = self.cursor.fetchall()

        if results:
            customers = []
            for result in results:
                customer_data = {
                    'customer_id': result[0],
                    'username': result[1],
                    'email': result[3],
                    'first_name': result[4],
                    'last_name': result[5],
                    'contact_address': result[6],
                    'created_at': result[7]
                }
                customers.append(customer_data)
            
            response_data = {
                'success': True,
                'customers': customers
            }
        else:
            response_data = {
                'success': False,
                'message': 'No customers found'
            }

        # Return the response data as a dictionary
        return response_data


if __name__ == "__main__":
    customer = Customer()
    customer.create_customer_account_table()
    customer.create_customer_account('customer', 'customer', 'customer@gmail.com', 'Juan', 'Dela Cruz', '123 Example St, City, Country')
    customer.close()  # Close the database connection when done
