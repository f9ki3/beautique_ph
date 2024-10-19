
function insertStock() {
    // Collecting input values
    const productId = $('#selected-id').val().trim(); // Get the selected product ID
    const productStocks = parseInt($('#product_stocks').val().trim(), 10); // Get stock input

    // Validate input fields
    if (!productId || isNaN(productStocks) || productStocks <= 0) {
        alert("Please select a product and enter a valid number of stocks.");
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('id', productId); // Append the product ID
    formData.append('stocks', productStocks); // Append stock value

    // Show loading indicator
    $('.category-load').show();
    $('.category-text').hide();

    // Submit the form data via AJAX
    $.ajax({
        url: '/insertStocks', // Adjust the URL for stock addition
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            $('#addCategorySuccess').show(); // Show success alert
            setTimeout(() => {
                location.reload(); // Reload the page after 1.5 seconds
            }, 1500);
        },
        error: function(xhr) {
            console.error("Error adding stock:", xhr.responseText);
            alert("Error adding stock: " + (xhr.responseJSON?.error || xhr.responseText)); // Provide user feedback
        },
        complete: function() {
            // Hide loading indicator
            $('.category-load').hide();
            $('.category-text').show();
        }
    });
}
