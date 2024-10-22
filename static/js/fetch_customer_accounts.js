// CustomerAccounts Pagination and Filtering
let activeCustomerAccountPage = 1; // Initial page for customer accounts
const customerAccountsPerPage = 10; // Set how many customer accounts you want per page
let allCustomerAccounts = []; // Array to hold all customer accounts
let filteredCustomerAccounts = []; // Array to hold filtered customer accounts

// Function to fetch all customer accounts from the server
function fetchAllCustomerAccounts() {
    $.ajax({
        type: "GET",
        url: "/fetchCustomerAccounts", // Endpoint to fetch all customer accounts
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            // console.log("Response:", response); // Log the response to check its structure
            // Extract customer accounts from the response
            allCustomerAccounts = response.customers || []; // Store all customer accounts in the array
            
            // Ensure allCustomerAccounts is an array
            if (!Array.isArray(allCustomerAccounts)) {
                console.error("Expected an array of customer accounts but got:", allCustomerAccounts);
                allCustomerAccounts = []; // Reset to an empty array if not valid
            }

            filteredCustomerAccounts = allCustomerAccounts; // Initialize filtered customer accounts
            renderCustomerAccounts(activeCustomerAccountPage); // Render customer accounts for the initial page
            createCustomerAccountPaginationControls(filteredCustomerAccounts.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching customer accounts:', error);
            $('#customerAccountTable').append('<tr><td colspan="6" class="text-center">Error loading customer accounts</td></tr>');
        }
    });
}


// Function to render customer accounts for the current page
function renderCustomerAccounts(page) {
    $('#customerAccountTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * customerAccountsPerPage; // Calculate starting index
    const endIndex = startIndex + customerAccountsPerPage; // Calculate ending index
    const customerAccountsToDisplay = filteredCustomerAccounts.slice(startIndex, endIndex); // Slice the array for the current page

    if (customerAccountsToDisplay.length > 0) {
        customerAccountsToDisplay.forEach((account, index) => {
            let row = `
                <tr>
                    <td class="pb-3 pt-3">${account.customer_id || 'N/A'}</td>
                    <td class="pb-3 pt-3">${account.username || 'N/A'}</td>
                    <td class="pb-3 pt-3">${account.email || 'N/A'}</td>
                    <td class="pb-3 pt-3">${account.first_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${account.last_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${account.contact_address || 'N/A'}</td>
                    <td class="pb-3 pt-3">${account.created_at || 'N/A'}</td>
                    <td class="pb-3 pt-3">
                        <button class="delete-button-customerAccounts" 
                                style="background: transparent; border: none" 
                                data-id="${account.customer_id}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>`;
            $('#customerAccountTable').append(row); // Append the new row to the table
        });
    } else {
        $('#customerAccountTable').append('<tr><td colspan="8" class="text-center">No customer accounts found</td></tr>');
    }
}

// Function to create pagination controls for customer accounts
function createCustomerAccountPaginationControls(totalCustomerAccounts) {
    const totalPages = Math.ceil(totalCustomerAccounts / customerAccountsPerPage);
    const paginationContainer = $('#paginationCustomerAccountControls');

    paginationContainer.empty(); // Clear existing pagination controls

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevCustomerAccountPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Add page number buttons dynamically
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        if (page === activeCustomerAccountPage) {
            pageItem.addClass('active');
        }

        pageLink.on('click', function(e) {
            e.preventDefault();
            activeCustomerAccountPage = page; // Update active page
            renderCustomerAccounts(activeCustomerAccountPage); // Render customer accounts for the selected page
            createCustomerAccountPaginationControls(totalCustomerAccounts); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextCustomerAccountPage">Next</a></li>');
    paginationContainer.append(nextItem);

    $('#prevCustomerAccountPage').parent().toggleClass('disabled', activeCustomerAccountPage <= 1);
    $('#nextCustomerAccountPage').parent().toggleClass('disabled', activeCustomerAccountPage >= totalPages);

    $('#prevCustomerAccountPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeCustomerAccountPage > 1) {
            activeCustomerAccountPage--; // Decrease active page
            renderCustomerAccounts(activeCustomerAccountPage); // Render customer accounts for the new page
            createCustomerAccountPaginationControls(totalCustomerAccounts); // Update pagination controls
        }
    });

    $('#nextCustomerAccountPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeCustomerAccountPage < totalPages) {
            activeCustomerAccountPage++; // Increase active page
            renderCustomerAccounts(activeCustomerAccountPage); // Render customer accounts for the new page
            createCustomerAccountPaginationControls(totalCustomerAccounts); // Update pagination controls
        }
    });
}

// Function to filter customer accounts based on search input
function filterCustomerAccounts() {
    const searchQuery = $('#searchCustomerAccount').val().toLowerCase(); // Get the search query
    filteredCustomerAccounts = allCustomerAccounts.filter(account => 
        account.username.toLowerCase().includes(searchQuery) ||
        account.email.toLowerCase().includes(searchQuery)
    ); // Filter customer accounts based on the search query

    activeCustomerAccountPage = 1; // Reset to the first page
    renderCustomerAccounts(activeCustomerAccountPage); // Render the filtered customer accounts
    createCustomerAccountPaginationControls(filteredCustomerAccounts.length); // Update pagination controls
}

// Attach the search functionality to the input field for customer accounts
$('#searchCustomerAccount').on('input', filterCustomerAccounts);

// Initial fetch of all customer accounts
fetchAllCustomerAccounts();
