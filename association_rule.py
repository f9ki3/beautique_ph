from database import Database

class AssociationRule(Database):
    def __init__(self):
        super().__init__()

    def createAssociationRuleTable(self):
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS association_rule (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            main_category_id INTEGER NOT NULL,
            link_category_id INTEGER NOT NULL,
            FOREIGN KEY (main_category_id) REFERENCES category(id),
            FOREIGN KEY (link_category_id) REFERENCES category(id)
        )
        ''')
        self.commit()

    def create_association_rule(self, main_category_id, link_category_id):
        # Check if the main_category_id already exists in the association_rule table
        self.cursor.execute('''
        SELECT COUNT(*) FROM association_rule WHERE main_category_id = ?
        ''', (main_category_id,))
        result = self.cursor.fetchone()

        # If the count is greater than 0, it means the main_category_id is a duplicate
        if result[0] > 0:
            return {"error": "Main category ID already exists."}

        # Proceed with inserting the rule if it's not a duplicate
        self.cursor.execute('''
        INSERT INTO association_rule (main_category_id, link_category_id)
        VALUES (?, ?)
        ''', (main_category_id, link_category_id))
        self.commit()
        return {"message": "Rule added successfully!"}


    def read_association_rules(self):
        self.cursor.execute('SELECT * FROM association_rule')
        return self.cursor.fetchall()  # Fetch all rows

    def read_association_rule(self, rule_id):
        self.cursor.execute('SELECT * FROM association_rule WHERE id = ?', (rule_id,))
        return self.cursor.fetchone()  # Fetch a single row
    
    def get_recommendation(self, main_category_id):
        # Fetch the link_category_id based on the main_category_id
        self.cursor.execute('SELECT link_category_id FROM association_rule WHERE main_category_id = ?', (main_category_id,))
        link_category = self.cursor.fetchone()

        # Initialize the result list
        result = []

        # Check if a link_category_id was found
        if link_category is not None:
            link_category_id = link_category[0]  # Get the first element (link_category_id)

            # Now, fetch up to 4 products where category_id matches link_category_id
            self.cursor.execute('SELECT id, price, product_image, product_name FROM products WHERE category_id = ? LIMIT 4', (link_category_id,))
            products = self.cursor.fetchall()  # Fetch up to 4 products that match the category_id

            # Populate the result list with product dictionaries
            for product in products:
                product_info = {
                    'id': product[0],                 # Product ID
                    'price': product[1],              # Product Price
                    'product_image': product[2],      # Product Image(s)
                    'product_name': product[3],       # Product Name
                }
                result.append(product_info)  # Append each product info to the result list

        return result  # Return the list of product dictionaries





    def update_association_rule(self, rule_id, main_category_id, link_category_id):
        self.cursor.execute('''
        UPDATE association_rule
        SET main_category_id = ?, link_category_id = ?
        WHERE id = ?
        ''', (main_category_id, link_category_id, rule_id))
        self.commit()

    def delete_association_rule(self, rule_id):
        self.cursor.execute('DELETE FROM association_rule WHERE id = ?', (rule_id,))
        self.commit()

if __name__ == "__main__":
    AssociationRule().createAssociationRuleTable()
    AssociationRule().create_association_rule(28, 29)