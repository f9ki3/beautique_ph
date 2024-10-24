// Stocks Pagination and Filtering
let activeStockPage = 1; // Initial page for stocks
const stocksPerPage = 10; // Set how many stocks you want per page
let allStocks = []; // Array to hold all stocks
let filteredStocks = []; // Array to hold filtered stocks

// Function to fetch all stocks from the server
function fetchAllStocks() {
    $.ajax({
        type: "GET",
        url: "/fetchAllStocks", // Endpoint to fetch all stocks
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            allStocks = response.stocks || response; // Store all stocks in the array
            filteredStocks = allStocks; // Initialize filtered stocks
            renderStocks(activeStockPage); // Render stocks for the initial page
            createStockPaginationControls(filteredStocks.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching stocks:', error);
            $('#stockTable').append('<tr><td colspan="6" class="text-center">Error loading stocks</td></tr>');
        }
    });
}

// Function to render stocks for the current page
function renderStocks(page) {
    $('#stockTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * stocksPerPage; // Calculate starting index
    const endIndex = startIndex + stocksPerPage; // Calculate ending index
    const stocksToDisplay = filteredStocks.slice(startIndex, endIndex); // Slice the array for the current page

    if (stocksToDisplay.length > 0) {
        stocksToDisplay.forEach((stock, index) => {
            let row = `
                <tr>
                    <td class="pb-3 pt-3">${stock.stock_date || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.product_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.stock_qty || 0}</td>
                    <td class="pb-3 pt-3">${stock.stock_type || 'N/A'}</td>
                    <td class="pb-3 pt-3">
                        <button class="delete-button-stocks" 
                                style="background: transparent; border: none" 
                                data-id="${stock.stock_id}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>`;
            $('#stockTable').append(row); // Append the new row to the table
        });
    } else {
        $('#stockTable').append('<tr><td colspan="6" class="text-center">No stocks found</td></tr>');
    }
}

// Function to create pagination controls for stocks
function createStockPaginationControls(totalStocks) {
    const totalPages = Math.ceil(totalStocks / stocksPerPage);
    const paginationContainer = $('#paginationStockControls');

    paginationContainer.empty(); // Clear existing pagination controls

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevStockPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Add page number buttons dynamically
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        if (page === activeStockPage) {
            pageItem.addClass('active');
        }

        pageLink.on('click', function(e) {
            e.preventDefault();
            activeStockPage = page; // Update active page
            renderStocks(activeStockPage); // Render stocks for the selected page
            createStockPaginationControls(totalStocks); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextStockPage">Next</a></li>');
    paginationContainer.append(nextItem);

    $('#prevStockPage').parent().toggleClass('disabled', activeStockPage <= 1);
    $('#nextStockPage').parent().toggleClass('disabled', activeStockPage >= totalPages);

    $('#prevStockPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeStockPage > 1) {
            activeStockPage--; // Decrease active page
            renderStocks(activeStockPage); // Render stocks for the new page
            createStockPaginationControls(totalStocks); // Update pagination controls
        }
    });

    $('#nextStockPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeStockPage < totalPages) {
            activeStockPage++; // Increase active page
            renderStocks(activeStockPage); // Render stocks for the new page
            createStockPaginationControls(totalStocks); // Update pagination controls
        }
    });
}

// Function to filter stocks based on search input
function filterStocks() {
    const searchQuery = $('#searchStock').val().toLowerCase(); // Get the search query
    filteredStocks = allStocks.filter(stock => 
        stock.stock_date.toLowerCase().includes(searchQuery) ||
        stock.product_name.toLowerCase().includes(searchQuery)
    ); // Filter stocks based on the search query

    activeStockPage = 1; // Reset to the first page
    renderStocks(activeStockPage); // Render the filtered stocks
    createStockPaginationControls(filteredStocks.length); // Update pagination controls
}

// Attach the search functionality to the input field for stocks
$('#searchStock').on('input', filterStocks);

// Initial fetch of all stocks
fetchAllStocks();


$(document).ready(function() {
    // Fetch products from the server
    $.ajax({
        url: '/fetchAllProducts',
        method: 'GET',
        contentType: "application/json",   // Correct content type for sending JSON
        dataType: "json",                  // Expect JSON response from the server
        data: { category_id: 'all' },
        success: function(products) {
            products.forEach(function(product) {
                $('#product-list').append(
                    $('<div>', {
                        class: 'product-option',
                        text: product.product_name,
                        'data-value': product.id
                    })
                );
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching products:', error);
        }
    });

    // Toggle the search container
    $('#selected-product-2').on('click', function() {
        $('#search-container').toggle();
        $('#search-input').val('').focus(); // Clear and focus the input
        filterProducts(''); // Show all products
    });

    // Filter products based on search input
    $('#search-input').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        filterProducts(searchTerm);
    });

    // Select a product
    $(document).on('click', '.product-option', function() {
        const productName = $(this).text();
        const productId = $(this).data('value');

        $('#selected-product-2').text(productName);
        $('#selected-id').val(productId);
        $('#search-container').hide();
    });

    // Function to filter products
    function filterProducts(searchTerm) {
        $('.product-option').each(function() {
            const productName = $(this).text().toLowerCase();
            $(this).toggle(productName.includes(searchTerm));
        });
    }

    // Hide search container when clicking outside
    $(document).on('click', function(event) {
        if (!$(event.target).closest('.custom-select').length) {
            $('#search-container').hide();
        }
    });
});

function insertStock() {
    // Collecting input values
    const productId = $('#selected-product-2').text().trim(); // Get selected product name
    const productStocks = parseInt($('#product_stocks').val().trim(), 10); // Get stock input

    // Validate input fields
    if (!productName || isNaN(productStocks) || productStocks <= 0) {
        alert("Please select a product and enter a valid number of stocks.");
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('id', productName);
    formData.append('stocks', productStocks); // Append stock value
    console.log(productName)
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