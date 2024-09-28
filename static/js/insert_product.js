// Fetch all categories
$.ajax({
    type: "GET",
    url: "/fetchAllCategories",
    contentType: "application/json", // This is fine for GET requests
    dataType: "json",
    success: function(response) {
        // Assuming 'response' is an array of categories
        const categories = response; 
        const $select = $('#selectCategories');
        
        // Clear existing options
        $select.empty();

        // Populate the select element with new options
        categories.forEach(function(category) {
            const option = $('<option></option>')
                .attr('value', category.id)  // Set the value to category ID
                .text(category.category_name); // Set the text to category name
            $select.append(option);
        });

        // console.log(categories);
    },
    error: function(xhr, status, error) {
        console.error('Error fetching categories:', error);
    }
});

// Function to insert product
function insertProduct() {
    // Get product elements
    const productNameElement = $('#addProductName');
    const productPriceElement = $('#addProductPrice');
    const productCategoryElement = $('#selectCategories');
    const productDescriptionElement = $('#addProductDescription');
    const productImageElement = $('#addProductImage');
    
    // Get product values
    const productName = productNameElement.val();
    const productPrice = parseFloat(productPriceElement.val()); // Parse as float for numeric comparison
    const productCategory = productCategoryElement.val();
    const productDescription = productDescriptionElement.val();
    const productImage = productImageElement[0].files[0]; // Get the file

    // Reset validation states
    productNameElement.removeClass('is-invalid');
    productPriceElement.removeClass('is-invalid');
    productCategoryElement.removeClass('is-invalid');
    productDescriptionElement.removeClass('is-invalid');
    productImageElement.removeClass('is-invalid');

    let isValid = true;

    // Check if fields are valid
    if (!productName) {
        productNameElement.addClass('is-invalid');
        isValid = false;
    }
    if (!productPrice || productPrice <= 0) { // Check for negative or zero
        productPriceElement.addClass('is-invalid');
        isValid = false;
    }
    if (!productCategory) {
        productCategoryElement.addClass('is-invalid');
        isValid = false;
    }
    if (!productDescription) {
        productDescriptionElement.addClass('is-invalid');
        isValid = false;
    }

    // Image validation
    if (!productImage) {
        productImageElement.addClass('is-invalid');
        isValid = false;
    }

    // If the form is not valid, log the error and stop the function
    if (!isValid) {
        console.error("Please fill in all required fields.");
        return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productPrice', productPrice);
    formData.append('productCategory', productCategory);
    formData.append('productDescription', productDescription);
    formData.append('productImage', productImage); // Include the image file

    // Send data to the server using jQuery AJAX
    $.ajax({
        url: '/addProducts',  // Change this URL to your actual API endpoint
        type: 'POST',
        data: formData,
        contentType: false, // Important for file upload
        processData: false, // Prevent jQuery from automatically transforming the data into a query string
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                console.log('Product added successfully:', response);

                // Show success alert
                $('#addProductSuccess').show();

                // Hide the alert after 3 seconds
                setTimeout(() => {
                    $('#addProductSuccess').hide();
                    location.reload();
                }, 1000);

                // Optionally, reset the form after submission
                productNameElement.val('');
                productPriceElement.val('');
                productCategoryElement.val('');
                productDescriptionElement.val('');
                productImageElement.val('');
            } else {
                console.error('Error adding product:', response.message);
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}
