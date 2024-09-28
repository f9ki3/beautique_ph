$.ajax({
    type: "GET",
    url: "/fetchAllCategories",          // Ensure the endpoint is correct
    contentType: "application/json",     // Correct content type for sending JSON
    dataType: "json",                    // Expect JSON response from the server
    success: function(response) {
        // Assuming response contains an array of categories
        var categoryLanding = $('#categoryLanding'); // Get the element where you want to add buttons
        categoryLanding.empty(); // Clear any existing content

        // Iterate through the response and create buttons
        response.forEach(function(category) {
            var button = $('<button class="btn btn-sm">' + category.category_name + '</button>');
            categoryLanding.append(button); // Append each button to the categoryLanding div
        });
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);  // Handle any errors that occur during the request
        $('.category-text').show();
        $('.category-load').hide();
    }
});


$.ajax({
    type: "GET",
    url: "/fetchAllProducts",          // Ensure the endpoint is correct
    contentType: "application/json",     // Correct content type for sending JSON
    dataType: "json",                    // Expect JSON response from the server
    success: function(response) {
        var productList = $('#productList'); // Get the element where you want to add products
        productList.empty(); // Clear any existing content

        // Iterate through the response and create product cards
        response.forEach(function(product) {
            var productHTML = `
                <div class="col-6 col-md-3">
                    <div class="p-3">
                        <div style="position: relative;">
                            <div style="width: 100%; height: 200px;">
                                <img style="object-fit: cover; width: 100%; height: 100%;" src="../static/uploads/${product.product_image}" alt="">
                                <button style="position: absolute; right: 10px; bottom: 10px;" class="btn border btn-pink rounded-5">
                                    <i class="bi bi-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                        <p class="mb-0">${product.product_name}</p>
                        <h6 class="fw-bolder mt-0">₱ ${product.price.toFixed(2)} PHP</h6>
                    </div>
                </div>`;
                
            productList.append(productHTML); // Append each product card to the productList div
        });
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);  // Handle any errors that occur during the request
        $('.category-text').show();
        $('.category-load').hide();
    }
});
