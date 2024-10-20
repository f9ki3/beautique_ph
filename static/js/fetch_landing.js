// Fetch all categories and create buttons
$.ajax({
    type: "GET",
    url: "/fetchAllCategories",          // Ensure the endpoint is correct
    contentType: "application/json",     // Correct content type for sending JSON
    dataType: "json",                    // Expect JSON response from the server
    success: function(response) {
        var categoryLanding = $('#categoryLanding'); // Get the element where you want to add buttons
        categoryLanding.empty(); // Clear any existing content

        // Create a default 'Show All' button
        var allButton = $('<button class="btn btn-sm active" data-category-id="all">All</button>');
        categoryLanding.append(allButton); // Append the 'Show All' button to the categoryLanding div

        // Iterate through the response and create buttons
        response.forEach(function(category) {
            var button = $('<button class="btn btn-sm" data-category-id="' + category.id + '">' + category.category_name + '</button>');
            categoryLanding.append(button); // Append each button to the categoryLanding div
        });

        // Load all products by default
        fetchProducts('all');

        // Attach click event to category buttons
        categoryLanding.on('click', 'button', function() {
            var categoryId = $(this).data('category-id');
            var categoryName = $(this).text(); // Get the text of the clicked button (category name)

            fetchProducts(categoryId); // Fetch products based on the category

            // Update the category header text
            if (categoryId === 'all') {
                $('#categoryHeader').text('All Category');
            } else {
                $('#categoryHeader').text(categoryName);
            }

            // Manage active class for buttons
            categoryLanding.find('button').removeClass('active'); // Remove active class from all buttons
            $(this).addClass('active'); // Add active class to the clicked button
        });
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);  // Handle any errors that occur during the request
        $('.category-text').show();
        $('.category-load').hide();
    }
});

// Function to fetch and display products based on the selected category
function fetchProducts(categoryId) {
    $.ajax({
        type: "GET",
        url: "/fetchAllProducts",          // Ensure the endpoint is correct
        contentType: "application/json",   // Correct content type for sending JSON
        dataType: "json",                  // Expect JSON response from the server
        data: { category_id: categoryId }, // Send selected category ID
        success: function(response) {
            var productList = $('#productList'); // Get the element where you want to add products
            productList.empty(); // Clear any existing content

            // Iterate through the response and create product cards
            response.forEach(function(product) {
                var productHTML = `
                    <div class="col-6 col-md-3">
                        <a href="product_view?product_id=${product.id}" style="text-decoration: none; color: inherit;">
                            <div class="p-3">
                                <div style="position: relative;">
                                    <div style="width: 100%; height: 200px;">
                                        <img style="object-fit: cover; width: 100%; height: 100%;" class="rounded" src="../static/uploads/${product.product_image.split(',')[0].trim()}" alt="">
                                        <button style="position: absolute; right: 10px; bottom: 10px;" class="btn border btn-pink rounded-5">
                                            <i class="bi bi-cart-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <p class="mb-0">${product.product_name.substring(0, 66)}...</p>
                                <h6 class="fw-bolder mt-0">₱ ${product.price.toFixed(2)} PHP</h6>
                            </div>
                        </a>
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
}
