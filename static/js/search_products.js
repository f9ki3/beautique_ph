$(document).ready(function() {
    // Function to get URL parameter
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Populate the input with product_name from URL (if exists)
    let productName = getUrlParameter('product_name');
    if (productName) {
        $('#search-input-data').val(productName);
    }

    // Function to redirect to search page
    function goToSearchPage() {
        let searchData = $('#search-input-data').val().trim();
        if (searchData) {
            window.location.href = '/search_product?product_name=' + encodeURIComponent(searchData);
        }
    }

    // Handle button click
    $('#button-addon2').on('click', function() {
        goToSearchPage();
    });

    // Handle "Enter" key press
    $('#search-input-data').on('keypress', function(e) {
        if (e.which === 13) { // 13 is the Enter key
            goToSearchPage();
        }
    });

    $.ajax({
        type: "GET",
        url: `/fetchAllProductsSearch?product_name=${productName}`, // Include product_name in the URL
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            var productList = $('#productListSearch'); // Get the element where you want to add products
            productList.empty(); // Clear any existing content
    
            // Check if the response is empty
            if (response.length === 0) {
                productList.append('<p>No results found.</p>'); // Show no results message
            } else {
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
            }
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);  // Handle any errors that occur during the request
            $('.category-text').show();
            $('.category-load').hide();
        }
    });    
});