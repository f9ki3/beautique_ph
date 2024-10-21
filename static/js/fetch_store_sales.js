// Stocks Pagination and Filtering for Store Sales
let activeStoreSalesPage = 1; // Initial page for Store Sales
const stocksPerStoreSalesPage = 10; // Set how many Store Sales you want per page
let allStoreSales = []; // Array to hold all Store Sales
let filteredStoreSales = []; // Array to hold filtered Store Sales

// Function to fetch all stocks from the server
function fetchAllStoreSales() {
    $.ajax({
        type: "GET",
        url: "/fetchStoreSales", // Endpoint to fetch all Store Sales
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            console.log(response);
            allStoreSales = response.stocks || response; // Store all Store Sales in the array
            filteredStoreSales = allStoreSales; // Initialize filtered stocks
            renderStoreSales(activeStoreSalesPage); // Render stocks for the initial page
            createStoreSalesPaginationControls(filteredStoreSales.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching Store Sales:', error);
            $('#storeSalesTable').append('<tr><td colspan="14" class="text-center">Error loading sales</td></tr>');
        }
    });
}

// Function to render stocks for the current page
function renderStoreSales(page) {
    $('#storeSalesTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * stocksPerStoreSalesPage; // Calculate starting index
    const endIndex = startIndex + stocksPerStoreSalesPage; // Calculate ending index
    const stocksToDisplay = filteredStoreSales.slice(startIndex, endIndex); // Slice the array for the current page

    if (stocksToDisplay.length > 0) {
        stocksToDisplay.forEach((stock) => {
            let row = `
                <tr>
                    <td class="pb-3 pt-3">${stock.id || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.created_at || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.subtotal || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.vat || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.total || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.customer_id || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.first_name || 'N/A'} ${stock.last_name || ''}</td>
                    <td class="pb-3 pt-3">${stock.email || 'N/A'}</td>
                    <td class="pb-3 pt-3">${stock.address || 'N/A'}</td>
                </tr>`;
            $('#storeSalesTable').append(row); // Append the new row to the table
        });
    } else {
        $('#storeSalesTable').append('<tr><td colspan="9" class="text-center">No Store Sales found</td></tr>');
    }
}

// Function to create pagination controls for stocks
function createStoreSalesPaginationControls(totalStocks) {
    const totalPages = Math.ceil(totalStocks / stocksPerStoreSalesPage);
    const paginationContainer = $('#paginationStoreSalesControls');

    paginationContainer.empty(); // Clear existing pagination controls

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevStoreSalesPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Calculate start and end page for continuous pagination
    const startPage = Math.max(1, activeStoreSalesPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    // Add page number buttons dynamically
    for (let page = startPage; page <= endPage; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        if (page === activeStoreSalesPage) {
            pageItem.addClass('active');
        }

        pageLink.on('click', function(e) {
            e.preventDefault();
            activeStoreSalesPage = page; // Update active page
            renderStoreSales(activeStoreSalesPage); // Render stocks for the selected page
            createStoreSalesPaginationControls(totalStocks); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextStoreSalesPage">Next</a></li>');
    paginationContainer.append(nextItem);

    $('#prevStoreSalesPage').parent().toggleClass('disabled', activeStoreSalesPage <= 1);
    $('#nextStoreSalesPage').parent().toggleClass('disabled', activeStoreSalesPage >= totalPages);

    $('#prevStoreSalesPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeStoreSalesPage > 1) {
            activeStoreSalesPage--; // Decrease active page
            renderStoreSales(activeStoreSalesPage); // Render stocks for the new page
            createStoreSalesPaginationControls(totalStocks); // Update pagination controls
        }
    });

    $('#nextStoreSalesPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeStoreSalesPage < totalPages) {
            activeStoreSalesPage++; // Increase active page
            renderStoreSales(activeStoreSalesPage); // Render stocks for the new page
            createStoreSalesPaginationControls(totalStocks); // Update pagination controls
        }
    });
}

// Function to filter stocks based on search input
function filterStoreSales() {
    const searchQuery = $('#searchStoreSales').val().toLowerCase(); // Get the search query
    filteredStoreSales = allStoreSales.filter(stock => 
        (stock.order_id && stock.order_id.toString().toLowerCase().includes(searchQuery)) || // Filter by order_id
        (stock.product_name && stock.product_name.toLowerCase().includes(searchQuery)) || // Filter by product_name
        (stock.description && stock.description.toLowerCase().includes(searchQuery)) // Also keep filtering by description
    ); // Filter stocks based on the search query

    activeStoreSalesPage = 1; // Reset to the first page
    renderStoreSales(activeStoreSalesPage); // Render the filtered stocks
    createStoreSalesPaginationControls(filteredStoreSales.length); // Update pagination controls
}

// Attach the search functionality to the input field for stocks
$('#searchStoreSales').on('input', filterStoreSales);

// Initial fetch of all stocks
fetchAllStoreSales();
