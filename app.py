from flask import Flask, redirect, render_template, request, jsonify, session, url_for, json
import os
from werkzeug.utils import secure_filename
from accounts import Accounts  
from categories import Categories
from products import Product
import base64

app = Flask(__name__)
app.secret_key = "asajkshakwqujbasj"

# Set the upload folder
app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')  # Change this to your upload folder path

@app.route('/', methods=['GET'])
def home():
    return render_template('landing_page.html')

@app.route('/product_view', methods=['GET'])
def product_view():
    product_id = request.args.get('product_id')  # Get the product_id from the query string
    # You can now use product_id to fetch product details from a database if needed
    return render_template('customer_view_product.html', product_id=product_id)

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
    
    # Retrieve the uploaded images (base64 strings)
    product_images = request.form.getlist('productImage[]')  # Handle base64 image data
    product_sizes = request.form.getlist('productSizes[]')  # Handle sizes array
    product_colors = request.form.getlist('productColors[]')  # Handle colors array

    # Check if all required fields are provided
    if not product_name or not product_price or not product_category or not product_description:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    # Validate product price
    try:
        product_price = float(product_price)  # Ensure price is a float
    except ValueError:
        return jsonify({"success": False, "message": "Invalid price format."}), 400

    print(f"Product Name: {product_name}")
    print(f"Product Price: {product_price}")
    print(f"Product Category: {product_category}")
    print(f"Product Description: {product_description}")
    print(f"Number of Images: {len(product_images)}")
    print(f"Sizes: {product_sizes}")
    print(f"Colors: {product_colors}")

    # Validate and save images
    saved_image_paths = []
    for index, base64_image in enumerate(product_images):
        if base64_image:
            # Split the base64 string to get the actual data
            header, encoded = base64_image.split(',', 1)  # Split the header and data
            file_extension = header.split(';')[0].split('/')[1]  # Extract file extension from the header
            safe_filename = f"{product_name}_{index + 1}.{file_extension}"  # Create a unique filename
            
            product_image_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_filename)
            print(f"Saving image to: {product_image_path}")  # Log the save path
            
            try:
                # Create the uploads directory if it doesn't exist
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

                # Decode the base64 string and write to file
                with open(product_image_path, 'wb') as f:
                    f.write(base64.b64decode(encoded))
                saved_image_paths.append(safe_filename)
            except Exception as e:
                print(f"Error saving image {safe_filename}: {e}")
                return jsonify({"success": False, "message": "Error saving image."}), 500
        else:
            print("No image found for one of the entries.")

    print(f"Saved Images: {saved_image_paths}")

    # Here you would typically save the product details to the database
    # Assuming Product is your model class
    print(saved_image_paths)
    Product().insertProduct(
    product_name, 
    product_category, 
    0,  # stocks
    product_price, 
    product_description, 
    'active',  # status
    ','.join(saved_image_paths) if saved_image_paths else None,  # Join image paths into a string
    ','.join(product_sizes) if product_sizes else None,  # Join sizes into a string
    ','.join(product_colors) if product_colors else None   # Join colors into a string
)

    # Return success response
    return jsonify({"success": True, "message": "Product added successfully."}), 201

@app.route('/get_product')
def view_product():
    product_id = request.args.get('product_id')  # Retrieve the product_id from query parameters
    if product_id:
        product_details = Product().view_product(product_id)
        # Process the product_id (e.g., fetch product details from a database)
        return jsonify(product_details)
    else:
        return jsonify({'error': 'Product ID not provided.'}), 400
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")