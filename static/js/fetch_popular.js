// Function to fetch and display products based on the selected category
function fetchProductsPopular() {
    $.ajax({
        type: "GET",
        url: "/fetchAllProductsPopular",  // Ensure this endpoint is correct
        contentType: "application/json",  // Correct content type for sending JSON
        dataType: "json",                 // Expect JSON response from the server
        success: function(response) {
            console.log(response)
            var productListPopular = $('#productListPopular'); // Get the element where you want to add products
            productListPopular.empty(); // Clear any existing content

            if (response.length === 0) {
                productListPopular.append('<p>No products available.</p>'); // Handle empty response
                return;
            }

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
                
                productListPopular.append(productHTML); // Append each product card to the productListPopular div
            });
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);  // Handle any errors that occur during the request
            $('.category-text').show();
            $('.category-load').hide();
        }
    });
}

fetchProductsPopular()