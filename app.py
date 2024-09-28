from flask import Flask, redirect, render_template, request, jsonify, session, url_for, json
import os
from werkzeug.utils import secure_filename
from accounts import Accounts  
from categories import Categories
from products import Product

app = Flask(__name__)
app.secret_key = "asajkshakwqujbasj"

# Ensure the static/uploads directory exists
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET'])
def home():
    return render_template('landing_page.html')

@app.route('/logout', methods=['GET'])
def logout():
    session.clear()
    return redirect('/admin-login')

@app.route('/admin-login', methods=['GET'])
def admin_login():
    if 'username' in session:
        return redirect('/dashboard')  # Redirect to the admin login page if not logged in
    return render_template('admin-login.html')

@app.route('/admin-dashboard', methods=['GET'])
def admin_dashboard():
    # Check if the user is logged in by verifying session data
    if 'username' not in session:
        return redirect(url_for('admin_login'))  # Redirect to the admin login page if not logged in
    return render_template('admin_dashboard.html')

@app.route('/admin-product', methods=['GET'])
def admin_product():
    # Check if the user is logged in by verifying session data
    if 'username' not in session:
        return redirect(url_for('admin_login'))  # Redirect to the admin login page if not logged in
    return render_template('admin-product.html')

@app.route('/admin-category', methods=['GET'])
def admin_category():
    # Check if the user is logged in by verifying session data
    if 'username' not in session:
        return redirect(url_for('admin_login'))  # Redirect to the admin login page if not logged in
    return render_template('admin-category.html')

# API ENDPOINTS
@app.route("/post_login", methods=['POST'])
def post_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    # Example login
    login_result = Accounts().login_admin_account(email, password)
    if login_result:
        session_data = Accounts().searchAccountSession(email, password)
        session_info = json.loads(session_data)

        # Store relevant information in the session
        if session_info['success']:
            session['admin_id'] = session_info['account']['admin_id']
            session['username'] = session_info['account']['username']
            session['email'] = session_info['account']['email']
            session['full_name'] = session_info['account']['full_name']

            print(session_info)  # Optional: Print session information for debugging

            return jsonify({'status': 1})  # Successful login response
        else:
            return jsonify({'status': 0, 'message': session_info['message']})
    else:
        return jsonify({'status': 0})

@app.route('/insertCategory', methods=['POST'])
def insert_category():
    # Get the JSON data from the request
    json_data = request.get_json()
    
    # Retrieve the categoryName from the JSON data
    category = json_data.get('categoryName')
    Categories().insertCategory(category)

    # Return a JSON response with the category
    return jsonify({'category': category})

@app.route('/fetchAllCategories', methods=['GET'])
def fetch_category():
    data = Categories().fetchAllCategories()
    return jsonify(data)

@app.route('/deleteCategory', methods=['POST'])
def delete_category():
    json = request.get_json()
    cat_id = json.get('id')
    Categories().deleteCategory(cat_id)
    return jsonify({'status': 1})

@app.route('/updateCategory', methods=['POST'])
def update_category():
    json = request.get_json()
    id = json.get('id')
    name = json.get('name')
    date = json.get('date')
    Categories().updateCategory( id, date, name)
    return jsonify({'status': 1})

@app.route('/fetchAllProducts', methods=['GET'])
def fetch_products():
    data = Product().fetchAllProducts()
    return jsonify(data)


@app.route('/addProducts', methods=['POST'])
def add_product():
    # Retrieve form data
    product_name = request.form.get('productName')
    product_price = request.form.get('productPrice')
    product_category = request.form.get('productCategory')
    product_description = request.form.get('productDescription')
    
    # Retrieve the uploaded file
    product_image = request.files.get('productImage')

    # Check if all required fields are provided
    if not product_name or not product_price or not product_category or not product_description:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    # Handle the image file
    if product_image:
        # Create a safe filename and save the file
        safe_filename = secure_filename(product_image.filename)  # Use secure_filename to avoid security issues
        product_image_path = os.path.join(UPLOAD_FOLDER, safe_filename)
        product_image.save(product_image_path)

    # Process the product data (e.g., save to a database)
    Product().insertProduct(product_name, product_category, 0, product_price, product_description, 0, safe_filename)

    # Return success response
    return jsonify({"success": True, "message": "Product added successfully."}), 201

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")