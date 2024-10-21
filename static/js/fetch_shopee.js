// Stocks Pagination and Filtering for Shopee
let activeShopeePage = 1; // Initial page for Shopee stocks
const stocksPerShopeePage = 10; // Set how many Shopee stocks you want per page
let allShopeeStocks = []; // Array to hold all Shopee stocks
let filteredShopeeStocks = []; // Array to hold filtered Shopee stocks

// Function to fetch all stocks from the server
function fetchAllShopeeStocks() {
    $.ajax({
        type: "GET",
        url: "/fetchShopee", // Endpoint to fetch all Shopee stocks
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            console.log(response);
            allShopeeStocks = response.stocks || response; // Store all Shopee stocks in the array
            filteredShopeeStocks = allShopeeStocks; // Initialize filtered stocks
            renderShopeeStocks(activeShopeePage); // Render stocks for the initial page
            createShopeeStockPaginationControls(filteredShopeeStocks.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching Shopee stocks:', error);
            $('#shopeeTable').append('<tr><td colspan="14" class="text-center">Error loading stocks</td></tr>');
        }
    });
}

// Function to render stocks for the current page
function renderShopeeStocks(page) {
    $('#shopeeTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * stocksPerShopeePage; // Calculate starting index
    const endIndex = startIndex + stocksPerShopeePage; // Calculate ending index
    const stocksToDisplay = filteredShopeeStocks.slice(startIndex, endIndex); // Slice the array for the current page

    if (stocksToDisplay.length > 0) {
        stocksToDisplay.forEach((stock) => {
            let row = `
                <tr>
                    <td class="pb-3 pt-3">${stock.order_id || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.order_status || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.tracking_number || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.shipping_option || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.shipment_method || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.estimated_ship_out_date || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.ship_time || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.order_creation_date || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.order_paid_time || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.product_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.variation_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.original_price || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.deal_price || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.quantity || 'N/A'}</td>
                </tr>`;
            $('#shopeeTable').append(row); // Append the new row to the table
        });
    } else {
        $('#shopeeTable').append('<tr><td colspan="8" class="text-center">No Shopee stocks found</td></tr>');
    }
}

// Function to create pagination controls for stocks
function createShopeeStockPaginationControls(totalStocks) {
    const totalPages = Math.ceil(totalStocks / stocksPerShopeePage);
    const paginationContainer = $('#paginationShopeeStockControls');

    paginationContainer.empty(); // Clear existing pagination controls

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevShopeeStockPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Calculate start and end page for continuous pagination
    const startPage = Math.max(1, activeShopeePage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Add page number buttons dynamically
    for (let page = startPage; page <= endPage; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        if (page === activeShopeePage) {
            pageItem.addClass('active');
        }

        pageLink.on('click', function(e) {
            e.preventDefault();
            activeShopeePage = page; // Update active page
            renderShopeeStocks(activeShopeePage); // Render stocks for the selected page
            createShopeeStockPaginationControls(totalStocks); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextShopeeStockPage">Next</a></li>');
    paginationContainer.append(nextItem);

    $('#prevShopeeStockPage').parent().toggleClass('disabled', activeShopeePage <= 1);
    $('#nextShopeeStockPage').parent().toggleClass('disabled', activeShopeePage >= totalPages);

    $('#prevShopeeStockPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeShopeePage > 1) {
            activeShopeePage--; // Decrease active page
            renderShopeeStocks(activeShopeePage); // Render stocks for the new page
            createShopeeStockPaginationControls(totalStocks); // Update pagination controls
        }
    });

    $('#nextShopeeStockPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeShopeePage < totalPages) {
            activeShopeePage++; // Increase active page
            renderShopeeStocks(activeShopeePage); // Render stocks for the new page
            createShopeeStockPaginationControls(totalStocks); // Update pagination controls
        }
    });
}

// Function to filter stocks based on search input
function filterShopeeStocks() {
    const searchQuery = $('#searchShopeeStock').val().toLowerCase(); // Get the search query
    filteredShopeeStocks = allShopeeStocks.filter(stock => 
        (stock.order_id && stock.order_id.toString().toLowerCase().includes(searchQuery)) || // Filter by order_id
        (stock.product_name && stock.product_name.toLowerCase().includes(searchQuery)) || // Filter by product_name
        (stock.description && stock.description.toLowerCase().includes(searchQuery)) // Also keep filtering by description
    ); // Filter stocks based on the search query

    activeShopeePage = 1; // Reset to the first page
    renderShopeeStocks(activeShopeePage); // Render the filtered stocks
    createShopeeStockPaginationControls(filteredShopeeStocks.length); // Update pagination controls
}

// Attach the search functionality to the input field for stocks
$('#searchShopeeStock').on('input', filterShopeeStocks);

// Initial fetch of all stocks
fetchAllShopeeStocks();
