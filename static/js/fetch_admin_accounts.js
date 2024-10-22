// AdminAccounts Pagination and Filtering
let activeAdminAccountPage = 1; // Initial page for Admin Accounts
const adminAccountsPerPage = 10; // Set how many Admin Accounts you want per page
let allAdminAccounts = []; // Array to hold all Admin Accounts
let filteredAdminAccounts = []; // Array to hold filtered Admin Accounts

// Function to fetch all Admin Accounts from the server
function fetchAllAdminAccounts() {
    $.ajax({
        type: "GET",
        url: "/fetchAdminAccounts", // Endpoint to fetch all Admin Accounts
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            allAdminAccounts = response.admins || response; // Store all Admin Accounts in the array
            filteredAdminAccounts = allAdminAccounts; // Initialize filtered Admin Accounts
            renderAdminAccounts(activeAdminAccountPage); // Render Admin Accounts for the initial page
            createAdminAccountPaginationControls(filteredAdminAccounts.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching Admin Accounts:', error);
            $('#adminAccountTable').append('<tr><td colspan="6" class="text-center">Error loading Admin Accounts</td></tr>');
        }
    });
}

// Function to render Admin Accounts for the current page
function renderAdminAccounts(page) {
    $('#adminAccountTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * adminAccountsPerPage; // Calculate starting index
    const endIndex = startIndex + adminAccountsPerPage; // Calculate ending index
    const adminAccountsToDisplay = filteredAdminAccounts.slice(startIndex, endIndex); // Slice the array for the current page

    if (adminAccountsToDisplay.length > 0) {
        adminAccountsToDisplay.forEach((adminAccount, index) => {
            let row = `
                <tr>
                    <td class="pb-3 pt-3">${adminAccount.admin_id || 'N/A'}</td>
                    <td class="pb-3 pt-3">${adminAccount.username || 'N/A'}</td>
                    <td class="pb-3 pt-3">${adminAccount.email || 'N/A'}</td>
                    <td class="pb-3 pt-3">${adminAccount.full_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${adminAccount.created_at || 'N/A'}</td>
                    <td class="pb-3 pt-3">
                        <button class="delete-button-adminAccounts" 
                                style="background: transparent; border: none" 
                                data-id="${adminAccount.admin_id}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>`;
            $('#adminAccountTable').append(row); // Append the new row to the table
        });
    } else {
        $('#adminAccountTable').append('<tr><td colspan="6" class="text-center">No Admin Accounts found</td></tr>');
    }
}

// Function to create pagination controls for Admin Accounts
function createAdminAccountPaginationControls(totalAdminAccounts) {
    const totalPages = Math.ceil(totalAdminAccounts / adminAccountsPerPage);
    const paginationContainer = $('#paginationAdminAccountControls');

    paginationContainer.empty(); // Clear existing pagination controls

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevAdminAccountPage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Add page number buttons dynamically
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        if (page === activeAdminAccountPage) {
            pageItem.addClass('active');
        }

        pageLink.on('click', function(e) {
            e.preventDefault();
            activeAdminAccountPage = page; // Update active page
            renderAdminAccounts(activeAdminAccountPage); // Render Admin Accounts for the selected page
            createAdminAccountPaginationControls(totalAdminAccounts); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextAdminAccountPage">Next</a></li>');
    paginationContainer.append(nextItem);

    $('#prevAdminAccountPage').parent().toggleClass('disabled', activeAdminAccountPage <= 1);
    $('#nextAdminAccountPage').parent().toggleClass('disabled', activeAdminAccountPage >= totalPages);

    $('#prevAdminAccountPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeAdminAccountPage > 1) {
            activeAdminAccountPage--; // Decrease active page
            renderAdminAccounts(activeAdminAccountPage); // Render Admin Accounts for the new page
            createAdminAccountPaginationControls(totalAdminAccounts); // Update pagination controls
        }
    });

    $('#nextAdminAccountPage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeAdminAccountPage < totalPages) {
            activeAdminAccountPage++; // Increase active page
            renderAdminAccounts(activeAdminAccountPage); // Render Admin Accounts for the new page
            createAdminAccountPaginationControls(totalAdminAccounts); // Update pagination controls
        }
    });
}

// Function to filter Admin Accounts based on search input
function filterAdminAccounts() {
    const searchQuery = $('#searchAdminAccount').val().toLowerCase(); // Get the search query
    filteredAdminAccounts = allAdminAccounts.filter(adminAccount => 
        adminAccount.admin_date.toLowerCase().includes(searchQuery) ||
        adminAccount.username.toLowerCase().includes(searchQuery)
    ); // Filter Admin Accounts based on the search query

    activeAdminAccountPage = 1; // Reset to the first page
    renderAdminAccounts(activeAdminAccountPage); // Render the filtered Admin Accounts
    createAdminAccountPaginationControls(filteredAdminAccounts.length); // Update pagination controls
}

// Attach the search functionality to the input field for Admin Accounts
$('#searchAdminAccount').on('input', filterAdminAccounts);

// Initial fetch of all Admin Accounts
fetchAllAdminAccounts();

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

function insertAdminAccount() {
    // Collecting input values
    const productId = $('#selected-product').text().trim(); // Get selected product name
    const productStocks = parseInt($('#product_stocks').val().trim(), 10); // Get stock input

    // Validate input fields
    if (!productId || isNaN(productStocks) || productStocks <= 0) {
        alert("Please select a product and enter a valid number of stocks.");
        return;
    }

    // Prepare form data for submission
    const formData = new FormData();
    formData.append('id', productId);
    formData.append('stocks', productStocks); // Append stock value

    // Show loading indicator
    $('.category-load').show();
    $('.category-text').hide();

    // Submit the form data via AJAX
    $.ajax({
        url: '/insertAdminAccounts', // Adjust the URL for Admin Account addition
        method: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            $('#addCategorySuccess').show(); // Show success alert
            setTimeout(() => {
                location.reload(); // Reload the page to see updated data
            }, 2000);
        },
        error: function(xhr, status, error) {
            console.error('Error inserting Admin Account:', error);
            alert("Failed to add Admin Account. Please try again.");
        },
        complete: function() {
            // Hide loading indicator
            $('.category-load').hide();
            $('.category-text').show();
        }
    });
}

// Add event listener to the insert button
$('#insert-admin-account-button').on('click', insertAdminAccount);
