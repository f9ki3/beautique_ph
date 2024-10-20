function placeorder() {
    // Get the values from the input fields
    var customerId = $('#customer_id').val(); // Get hidden input value
    var firstName = $('#cart_fname').val(); // Get first name input value
    var lastName = $('#cart_lname').val(); // Get last name input value
    var email = $('#cart_email').val(); // Get email input value
    var address = $('#cart_address').val(); // Get address textarea value

    // Get the text content of subtotal, vat, and total using jQuery
    var subtotal = parseFloat($('#subtotal').text().replace(/₱|,/g, '').trim());
    var vat = parseFloat($('#vat').text().replace(/₱|,/g, '').trim());
    var total = parseFloat($('#total').text().replace(/₱|,/g, '').trim());

    // Get cart items from local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || []; 

    // Log the values to the console
    console.log('Subtotal:', subtotal);
    console.log('VAT:', vat);
    console.log('Total:', total);
    console.log('Customer ID:', customerId);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Email:', email);
    console.log('Address:', address);
    console.log('Cart Items:', cart); // Log the cart items

    // Prepare data to send to Flask
    var orderData = {
        subtotal: subtotal,
        vat: vat,
        total: total,
        customer_id: customerId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        address: address,
        cart_items: cart // Optionally convert cart items to a string if needed
    };

    // Send data to the Flask endpoint
    $.ajax({
        url: '/sales', // Adjust this URL to match your Flask endpoint
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(orderData),
        success: function(response) {
            console.log('Order placed successfully:', response);
            // Clear the cart from local storage
            localStorage.removeItem('cart');

            // Optionally handle success, e.g., show a confirmation message
            window.location.href="/order_success"
        },
        error: function(xhr, status, error) {
            console.error('Error placing order:', error);
            // Optionally handle error, e.g., show an error message
        }
    });
}
