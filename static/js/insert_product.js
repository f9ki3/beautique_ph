// Function to insert product
function insertProduct() {
    // Get product elements
    const productNameElement = $('#addProductName');
    const productPriceElement = $('#addProductPrice');
    const productCategoryElement = $('#selectCategories');
    const productDescriptionElement = $('#addProductDescription');
    const productImageElement = $('#addProductImage'); // Ensure this element is defined

    // Get product values
    const productName = productNameElement.val().trim();
    const productPrice = parseFloat(productPriceElement.val()); // Parse as float for numeric comparison
    const productCategory = productCategoryElement.val();
    const productDescription = productDescriptionElement.val().trim();
    const productImage = imageDataArray; // Array of images
    const productSizes = sizes; // Array of sizes
    const productColors = colors; // Array of colors

    // Reset validation states
    const elements = [productNameElement, productPriceElement, productCategoryElement, productDescriptionElement, productImageElement];
    elements.forEach(el => el.removeClass('is-invalid'));

    let isValid = true;

    // Validate fields
    if (!productName) {
        productNameElement.addClass('is-invalid');
        isValid = false;
    }
    if (!productPrice || productPrice <= 0) {
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
    if (!productImage || productImage.length === 0) {
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

    // Append arrays to FormData
    productImage.forEach(image => formData.append('productImage[]', image)); // Use '[]' for array
    productSizes.forEach(size => formData.append('productSizes[]', size)); // Use '[]' for array
    productColors.forEach(color => formData.append('productColors[]', color)); // Use '[]' for array

    // Log FormData entries for debugging
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    // }

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

                // Hide the alert after 1 second
                setTimeout(() => {
                    $('#addProductSuccess').hide();
                    location.reload();
                }, 1000);

                // Optionally, reset the form after submission
                elements.forEach(el => el.val(''));
            } else {
                console.error('Error adding product:', response.message);
            }
        },
        error: function(error) {
            console.error('Error:', error);
        }
    });
}
