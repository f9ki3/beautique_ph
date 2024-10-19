let activePageStocks = 1; // Initial page
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
            // console.log("Server response:", response);
            allStocks = response.stocks || response; // Store all stocks in the array
            filteredStocks = allStocks; // Initialize filtered stocks
            renderStocks(activePageStocks); // Render stocks for the initial page
            createPaginationControls(filteredStocks.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching stocks:', error);
            $('#stockTable').append('<tr><td colspan="8" class="text-center">Error loading stocks</td></tr>');
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
            // console.log("Stock:", stock); // Log each stock for debugging

            // Create a new row for each stock
            let row = `
                <tr>
                    <th scope="row">${startIndex + index + 1}</th>
                    <td>${stock.stock_date || 'N/A'}</td>
                    <td>${stock.product_name || 'N/A'}</td>
                    <td>${stock.stock_qty || 0}</td>
                    <td>${stock.stock_type || 'N/A'}</td>
                    <td>
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
        $('#stockTable').append('<tr><td colspan="8" class="text-center">No stocks found</td></tr>');
    }
}

// Function to create pagination controls
function createPaginationControls(totalStocks) {
    const totalPages = Math.ceil(totalStocks / stocksPerPage);
    const paginationContainer = $('#paginationStockControls');

    // Clear previous page numbers
    paginationContainer.find('li.page-number').remove();

    // Clear existing pagination controls
    paginationContainer.empty();

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevStockPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Add page number buttons dynamically
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        // Highlight the current page
        if (page === activePageStocks) {
            pageItem.addClass('active');
        }

        // Set up click event for pagination links
        pageLink.on('click', function(e) {
            e.preventDefault();
            activePageStocks = page; // Update active page
            renderStocks(activePageStocks); // Render stocks for the selected page
            createPaginationControls(totalStocks); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextStockPage">Next</a></li>');
    paginationContainer.append(nextItem);

    // Enable/disable Previous button
    $('#prevStockPage').parent().toggleClass('disabled', activePageStocks <= 1);
    // Enable/disable Next button
    $('#nextStockPage').parent().toggleClass('disabled', activePageStocks >= totalPages);

    // Handle Previous button click
    $('#prevStockPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activePageStocks > 1) {
            activePageStocks--; // Decrease active page
            renderStocks(activePageStocks); // Render stocks for the new page
            createPaginationControls(totalStocks); // Update pagination controls
        }
    });

    // Handle Next button click
    $('#nextStockPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activePageStocks < totalPages) {
            activePageStocks++; // Increase active page
            renderStocks(activePageStocks); // Render stocks for the new page
            createPaginationControls(totalStocks); // Update pagination controls
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

    activePageStocks = 1; // Reset to the first page
    renderStocks(activePageStocks); // Render the filtered stocks
    createPaginationControls(filteredStocks.length); // Update pagination controls
}

// Attach the search functionality to the input field
$('#searchStock').on('input', filterStocks);

// Initial fetch of all stocks
fetchAllStocks();
$(document).ready(function() {
    // Fetch products from the server
    $.ajax({
        url: '/fetchAllProducts',
        method: 'GET',
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
    $('#selected-product').on('click', function() {
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

        $('#selected-product').text(productName);
        $('#selected-id').val(productId); // Store the product ID in the hidden input
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
