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

    // Add to cart button
    $('#add-to-cart').click(function() {
        const qty = parseInt($('#quantity').val());
        if (validateInput(qty)) {
            // Add to cart logic here
            alert(`Added ${qty} to cart!`);
        } else {
            alert('Please enter a valid quantity.');
        }
    });
});
