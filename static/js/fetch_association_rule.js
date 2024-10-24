// Association Rule Pagination and Filtering
let activeAssociationRulePage = 1; // Initial page for association rules
const associationRulesPerPage = 10; // Set how many association rules you want per page
let allAssociationRules = []; // Array to hold all association rules
let filteredAssociationRules = []; // Array to hold filtered association rules

// Function to fetch all association rules from the server
function fetchAllAssociationRules() {
    $.ajax({
        type: "GET",
        url: "/fetchAllAssociationRules", // Endpoint to fetch all association rules
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            allAssociationRules = response.rules || response; // Store all rules in the array
            filteredAssociationRules = allAssociationRules; // Initialize filtered association rules
            renderAssociationRules(activeAssociationRulePage); // Render association rules for the initial page
            createAssociationRulePaginationControls(filteredAssociationRules.length); // Create pagination controls
        },
        error: function(xhr, status, error) {
            console.error('Error fetching association rules:', error);
            $('#associationRuleTable').append('<tr><td colspan="6" class="text-center">Error loading association rules</td></tr>');
        }
    });
}

// Function to render association rules for the current page
function renderAssociationRules(page) {
    $('#associationRuleTable').empty(); // Clear existing rows in the table
    const startIndex = (page - 1) * associationRulesPerPage; // Calculate starting index
    const endIndex = startIndex + associationRulesPerPage; // Calculate ending index
    const rulesToDisplay = filteredAssociationRules.slice(startIndex, endIndex); // Slice the array for the current page

    if (rulesToDisplay.length > 0) {
        rulesToDisplay.forEach((rule) => {
            let row = `
                <tr>
                    <td class="pb-3 pt-3">${rule.id || 'N/A'}</td>
                    <td class="pb-3 pt-3">${rule.category_name || 'N/A'}</td>
                    <td class="pb-3 pt-3">${rule.main_category_id || 0}</td>
                    <td class="pb-3 pt-3">${rule.link_category_id || 'N/A'}</td>
                    <td class="pb-3 pt-3">
                        <button class="delete-button-associationRule" 
                                style="background: transparent; border: none" 
                                data-id="${rule.id}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                </tr>`;
            $('#associationRuleTable').append(row); // Append the new row to the table
        });
    } else {
        $('#associationRuleTable').append('<tr><td colspan="6" class="text-center">No association rules found</td></tr>');
    }
}

// Function to create pagination controls for association rules
function createAssociationRulePaginationControls(totalRules) {
    const totalPages = Math.ceil(totalRules / associationRulesPerPage);
    const paginationContainer = $('#paginationAssociationRuleControls');

    paginationContainer.empty(); // Clear existing pagination controls

    // Add Previous button
    const prevItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="prevAssociationRulePage">Previous</a></li>');
    paginationContainer.append(prevItem);

    // Add page number buttons dynamically
    for (let page = 1; page <= totalPages; page++) {
        const pageItem = $('<li class="page-item page-pink page-number"></li>');
        const pageLink = $(`<a class="page-link" href="#">${page}</a>`);

        if (page === activeAssociationRulePage) {
            pageItem.addClass('active');
        }

        pageLink.on('click', function(e) {
            e.preventDefault();
            activeAssociationRulePage = page; // Update active page
            renderAssociationRules(activeAssociationRulePage); // Render rules for the selected page
            createAssociationRulePaginationControls(totalRules); // Recreate pagination controls
        });

        pageItem.append(pageLink);
        paginationContainer.append(pageItem); // Append page item to pagination container
    }

    // Add Next button
    const nextItem = $('<li class="page-item page-pink"><a class="page-link" href="#" id="nextAssociationRulePage">Next</a></li>');
    paginationContainer.append(nextItem);

    $('#prevAssociationRulePage').parent().toggleClass('disabled', activeAssociationRulePage <= 1);
    $('#nextAssociationRulePage').parent().toggleClass('disabled', activeAssociationRulePage >= totalPages);

    $('#prevAssociationRulePage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeAssociationRulePage > 1) {
            activeAssociationRulePage--; // Decrease active page
            renderAssociationRules(activeAssociationRulePage); // Render rules for the new page
            createAssociationRulePaginationControls(totalRules); // Update pagination controls
        }
    });

    $('#nextAssociationRulePage').off('click').on('click', function(e) {
        e.preventDefault();
        if (activeAssociationRulePage < totalPages) {
            activeAssociationRulePage++; // Increase active page
            renderAssociationRules(activeAssociationRulePage); // Render rules for the new page
            createAssociationRulePaginationControls(totalRules); // Update pagination controls
        }
    });
}

// Function to filter association rules based on search input
function filterAssociationRules() {
    const searchQuery = $('#searchAssociationRule').val().toLowerCase(); // Get the search query
    filteredAssociationRules = allAssociationRules.filter(rule => 
        (rule.id && rule.id.toString().toLowerCase().includes(searchQuery)) ||  // Convert id to string for comparison
        (rule.category_name && rule.category_name.toLowerCase().includes(searchQuery)) // Check if category_name includes the search query
    ); // Filter association rules based on the search query

    activeAssociationRulePage = 1; // Reset to the first page
    renderAssociationRules(activeAssociationRulePage); // Render the filtered rules
    createAssociationRulePaginationControls(filteredAssociationRules.length); // Update pagination controls
}

// Attach the search functionality to the input field for association rules
$('#searchAssociationRule').on('input', filterAssociationRules);

// Initial fetch of all association rules
fetchAllAssociationRules();
