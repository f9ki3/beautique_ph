// Customer Information
var customerId = $('#customer_id').val(); // Get the customer_id value

$.ajax({
    url: '/customer_information', // Replace with your server endpoint
    type: 'POST', // Or 'GET' depending on your server setup
    data: {
        customer_id: customerId
    },
    success: function(response) {
        // Handle the response from the server
        const cart_fname = response.customer.first_name
        const cart_lname = response.customer.last_name
        const cart_email = response.customer.email
        const cart_address = response.customer.contact_address

        $('#cart_fname').val(cart_fname)
        $('#cart_lname').val(cart_lname)
        $('#cart_email').val(cart_email)
        $('#cart_address').val(cart_address)
    },
    error: function(xhr, status, error) {
        // Handle any errors that occur
        console.error(error);
    }
});

$(document).ready(function() {
    const maxStocks = parseInt($('#product_stocks').text().split(': ')[1]); // Extract stocks from the text

    // Function to validate input
    function validateInput(value) {
        const numberValue = parseInt(value);
        return !isNaN(numberValue) && numberValue >= 1 && numberValue <= maxStocks; // Ensure minimum value is 1
    }

    // Clear input on focus
    $('#quantity').focus(function() {
        $(this).val(''); // Clear the input when focused
    });

    // Set value to 1 on focus out (if invalid or empty)
    $('#quantity').blur(function() {
        const inputValue = $(this).val();
        if (!validateInput(inputValue)) {
            $(this).val(1); // Set to 1 if the input is invalid or empty
        }
    });

    // Update quantity based on input
    $('#quantity').on('input', function() {
        const inputValue = $(this).val();
        if (!validateInput(inputValue)) {
            $(this).val(1); // Reset to 1 if invalid
        }
    });

    // Increment button
    $('#increment').click(function() {
        let currentQty = parseInt($('#quantity').val()) || 1; // Default to 1 if empty or invalid
        if (validateInput(currentQty + 1)) {
            $('#quantity').val(currentQty + 1);
        }
    });

    // Decrement button
    $('#decrement').click(function() {
        let currentQty = parseInt($('#quantity').val()) || 1; // Default to 1 if empty or invalid
        if (currentQty > 1) { // Prevent decrementing below 1
            $('#quantity').val(currentQty - 1);
        }
    });

});

function add_to_cart() {
    // Make sure you have the correct values from the response or page
    const imageSrc = $('#view_image').attr('src');
    const product_id = productId; // Ensure productId is defined somewhere
    const max_stock = parseInt($('#product_stocks').text().split(': ')[1]); // Extract max stocks from the text
    const category_name = $('#product_category').text().split(': ')[1].trim(); // Extract category name from the text
    const qty = parseInt($('#quantity').val(), 10); // Parse quantity as an integer
    const product_name = $('#product_name').text(); // Assuming product name is displayed
    const price = parseFloat($('#product_price').text().replace(/[^0-9.-]+/g, "")); // Remove currency formatting for price

    let selectedSize = null;
    let selectedColor = null;

    // Check if a size was selected
    $('#btn_sizes button').each(function() {
        if ($(this).hasClass('btn-pink')) {
            selectedSize = $(this).text().trim(); // Get the selected size
        }
    });

    // Check if a color was selected
    $('#btn_colors button').each(function() {
        if ($(this).hasClass('btn-pink')) {
            selectedColor = $(this).text().trim(); // Get the selected color
        }
    });

    // Alert if either size or color is not selected
    if (!selectedSize || !selectedColor) {
        alert('Please select both a size and a color.');
        return; // Prevent further actions if either is not selected
    }

    // Validate quantity
    if (qty <= 0 || qty > max_stock) {
        alert(`Please enter a valid quantity (1 - ${max_stock}).`);
        return; // Prevent further actions if the quantity is invalid
    }

    // Prepare the item to be added to the cart
    const cartItem = {
        product_id,
        product_name,
        price,
        qty,
        selectedSize,
        selectedColor,
        imageSrc,
        max_stock, // Add max_stock to the cart item
        category_name // Add category_name to the cart item
    };

    // Retrieve existing cart items from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingProductIndex = cart.findIndex(item => item.product_id === product_id);
    if (existingProductIndex > -1) {
        // If it exists, update the quantity
        const updatedQty = cart[existingProductIndex].qty + qty;
        if (updatedQty > max_stock) {
            alert(`Cannot add more than ${max_stock} of this item.`);
            return; // Prevent adding more than available stock
        }
        cart[existingProductIndex].qty = updatedQty;
    } else {
        // If it doesn't exist, add the new item
        cart.push(cartItem);
    }
    
    // Save the updated cart back to local storage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Successfully added to cart');
    updateCartItemCount();
    // Console log the values
    console.log(`Product ID: ${product_id}`);
    console.log(`Product Name: ${product_name}`);
    console.log(`Price: PHP ${price.toFixed(2)}`);
    console.log(`Qty: ${qty}`);
    console.log(`Selected Size: ${selectedSize}`);
    console.log(`Selected Color: ${selectedColor}`);
    console.log(`Image: ${imageSrc}`);
}

// Trigger add_to_cart function on clicking add-to-cart button
$('#add-to-cart').click(function() {
    add_to_cart(); // Call the function when the "Add to Cart" button is clicked
});

// Cart Display
function populateTable() {
    const tbody = document.getElementById('product-body');
    tbody.innerHTML = ''; // Clear any existing rows

    const cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart items from local storage

    // Check if the cart is empty
    if (cart.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center pt-5">
                    <h5>Your cart is empty.</h5>
                </td>
            </tr>
        `;

        $('#check_out_div').hide();
        updateTotals(0, 0, 0); // Update totals when cart is empty
        return; // Exit the function if the cart is empty
    }

    $('#check_out_div').show();

    let subtotal = 0; // Initialize subtotal

    cart.forEach(product => {
        const total = product.price * product.qty; // Use qty from the product object
        subtotal += total; // Accumulate subtotal
        const formattedPrice = product.price.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
        const formattedTotal = total.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
        
        const row = `
            <tr>
                <td class="pt-5 align-top">
                    <div class="d-flex flex-row">
                        <div style="width: 150px; height: 150px;">
                            <img style="object-fit: cover; width: 100%; height: 100%;" class="rounded-3" src="${product.imageSrc}" alt="">
                        </div>
                        <div class="ms-3" style="width: 70%">
                            <p class="p-0 m-0 mt-2 text-muted" style="font-size: 14px;">SKU BEAUTIQUE00${product.product_id}</p>
                            <h5 class="mt-2 fw-bolder">${product.product_name}</h5>
                            <p class="p-0 m-0 mt-2 text-muted" style="font-size: 14px;">${formattedPrice}</p>
                            <p class="p-0 m-0 mt-2 text-muted" style="font-size: 14px;">${product.category_name}, ${product.selectedSize}, ${product.selectedColor}</p>
                        </div>
                    </div>
                </td>
                <td class="pt-5 align-top">
                    <div class="btn-group border" role="group" aria-label="Basic example" style="width: 100%;">
                        <button type="button" class="btn" onclick="changeQuantity('${product.product_id}', -1)">-</button>
                        <input type="text" class="text-center" style="width: 50px; text-align: center;" value="${product.qty}" readonly> <!-- Readonly for demo -->
                        <button type="button" class="btn" onclick="changeQuantity('${product.product_id}', 1)">+</button>
                        <button type="button" class="btn" onclick="removeProduct('${product.product_id}')"><i class="bi bi-trash3"></i></button>
                    </div>
                    <p class="mt-3 text-muted" style="font-size: 14px">Stocks: ${product.max_stock}</p> <!-- Display max stock -->
                </td>
                <td class="pt-5 text-end align-top">${formattedTotal}</td>
            </tr>
        `;
        tbody.innerHTML += row; // Append the new row to the tbody
    });

    const vat = subtotal * 0.12; // Calculate VAT (12%)
    const total = subtotal + vat; // Calculate total

    // Update the displayed totals
    updateTotals(subtotal, vat, total);
}

// Function to update the totals in the DOM
function updateTotals(subtotal, vat, total) {
    document.getElementById('subtotal').innerText = subtotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
    document.getElementById('vat').innerText = vat.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
    document.getElementById('total').innerText = subtotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
}

// Call the function to populate the table on page load
window.onload = populateTable;

// Function to change quantity
function changeQuantity(product_id, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart items from local storage
    const product = cart.find(p => p.product_id === product_id);
    if (product) {
        const newQty = product.qty + change;
        if (newQty < 1) {
            product.qty = 1; // Prevent negative quantities
        } else if (newQty > product.max_stock) {
            alert(`Cannot exceed max stock of ${product.max_stock}.`);
            return; // Prevent exceeding max stock
        } else {
            product.qty = newQty;
        }
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
        populateTable(); // Refresh the table
    }
}

// Function to remove a product
function removeProduct(product_id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart items from local storage
    const index = cart.findIndex(p => p.product_id === product_id);
    if (index > -1) {
        cart.splice(index, 1); // Remove the product from the array
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
        populateTable(); // Refresh the table
        updateCartItemCount();
    }
}

// counter
// Function to update the cart item count
function updateCartItemCount() {
    // Get cart items from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Count the number of items in the cart
    let itemCount = cart.length;

    // Update the count displayed in the badge
    const cartItemCountElement = document.getElementById('cart-item-count');
    cartItemCountElement.textContent = itemCount;

    // Optionally, hide the badge if the count is zero
    if (itemCount === 0) {
        cartItemCountElement.style.display = 'none';
    } else {
        cartItemCountElement.style.display = 'block';
    }
}

// Call the function to update the count when the page loads
updateCartItemCount();
