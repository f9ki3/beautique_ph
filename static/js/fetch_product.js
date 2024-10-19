let activePage = 1; // Initial page
const productsPerPage = 10; // Set how many products you want per page
let allProducts = []; // Array to hold all products
let filteredProducts = []; // Array to hold filtered products

// Function to fetch all products from the server
function fetchAllProducts() {
    $.ajax({
        type: "GET",
        url: "/fetchAllProducts",          // Ensure the endpoint is correct
        contentType: "application/json",   // Correct content type for sending JSON
        dataType: "json",                  // Expect JSON response from the server
        data: { category_id: 'all' },
        success: function(response) {
            // console.log("Server response:", response);
            allProducts = response.products || response; // Store all products in the array
            filteredProducts = allProducts; // Initialize filtered products
            renderProducts(activePage); // Render products for the initial page
            createPaginationControls(filteredProducts.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching products:', error);
            $('#productTable').append('<tr><td colspan="8" class="text-center">Error loading products</td></tr>');
        }
    });
}

// Function to render products for the current page
function renderProducts(page) {
    $('#productTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * productsPerPage; // Calculate starting index
    const endIndex = startIndex + productsPerPage; // Calculate ending index
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex); // Slice the array for the current page

    if (productsToDisplay.length > 0) {
        productsToDisplay.forEach((product, index) => {
            // console.log("Product:", product); // Log each product for debugging

            // Create a new row for each product
            let row = `
                <tr>
                    <th scope="row">${startIndex + index + 1}</th>
                    <td>
                        <div style="width: 50px; height: 50px">
                            <img src="../static/uploads/${product.product_image.split(',')[0].trim()}" 
                                alt="${product.product_name}" 
                                style="object-fit: cover; width: 100%; height: 100%;">
                        </div>
                    </td>
                    <td>${product.price ? `₱${product.price.toFixed(2)}` : 'N/A'}</td>
                    <td>${product.product_name || 'N/A'}</td>
                    <td>${product.description || 'N/A'}</td>
                    <td>${product.stocks || 0}</td>
                    <td>
                        <button class="delete-button-product" 
                                style="background: transparent; border: none" 
                                data-id="${product.id}">
                            <i class="bi bi-trash3"></i>
                        </button>
                        <button class="edit-button" 
                                style="background: transparent; border: none" 
                                data-id="${product.id}" 
                                data-name="${product.product_name}" 
                                data-price="${product.price}" 
                                data-status="${product.status}">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                </tr>`;
        

            $('#productTable').append(row); // Append the new row to the table
        });
    } else {
        $('#productTable').append('<tr><td colspan="8" class="text-center">No products found</td></tr>');
    }
}

// Function to create pagination controls
function createPaginationControls(totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginationContainer = $('#paginationProductControls');

    // Clear previous page numbers
    paginationContainer.find('li.page-number').remove();

    // Clear existing pagination controls
    paginationContainer.empty();

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevProductPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Add page number buttons dynamically
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        // Highlight the current page
        if (page === activePage) {
            pageItem.addClass('active');
        }

        // Set up click event for pagination links
        pageLink.on('click', function(e) {
            e.preventDefault();
            activePage = page; // Update active page
            renderProducts(activePage); // Render products for the selected page
            createPaginationControls(totalProducts); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextProductPage">Next</a></li>');
    paginationContainer.append(nextItem);

    // Enable/disable Previous button
    $('#prevProductPage').parent().toggleClass('disabled', activePage <= 1);
    // Enable/disable Next button
    $('#nextProductPage').parent().toggleClass('disabled', activePage >= totalPages);

    // Handle Previous button click
    $('#prevProductPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activePage > 1) {
            activePage--; // Decrease active page
            renderProducts(activePage); // Render products for the new page
            createPaginationControls(totalProducts); // Update pagination controls
        }
    });

    // Handle Next button click
    $('#nextProductPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activePage < totalPages) {
            activePage++; // Increase active page
            renderProducts(activePage); // Render products for the new page
            createPaginationControls(totalProducts); // Update pagination controls
        }
    });
}

// Function to filter products based on search input
function filterProducts() {
    const searchQuery = $('#searchProduct').val().toLowerCase(); // Get the search query
    filteredProducts = allProducts.filter(product => 
        product.product_name.toLowerCase().includes(searchQuery) || 
        product.description.toLowerCase().includes(searchQuery)
    ); // Filter products based on the search query

    activePage = 1; // Reset to the first page
    renderProducts(activePage); // Render the filtered products
    createPaginationControls(filteredProducts.length); // Update pagination controls
}

// Attach the search functionality to the input field
$('#searchProduct').on('input', filterProducts);

// Initial fetch of all products
fetchAllProducts();
