// Configuration for pagination
const itemsPerPage = 10; // Number of items to display per page
let currentPage = 1; // Initialize current page
let categories = []; // Array to store the fetched categories
let filteredCategories = []; // Array to store filtered categories

// Fetch categories from the server
$.ajax({
    type: "GET",
    url: "/fetchAllCategories",          // Ensure the endpoint is correct
    contentType: "application/json",     // Correct content type for sending JSON
    dataType: "json",                    // Expect JSON response from the server
    success: function(response) {
        categories = response; // Store the fetched categories
        filteredCategories = categories; // Initialize filtered categories
        renderTable();         // Render the initial table
        setupPagination();      // Setup pagination
    },
    error: function(xhr, status, error) {
        console.error('Error:', error);  // Handle any errors that occur during the request
        $('.category-text').show();
        $('.category-load').hide();
    }
});

// Event listener for the search input
$('#categorySearch').on('input', function() {
    const searchTerm = $(this).val().toLowerCase(); // Get the search term
    filteredCategories = categories.filter(category => 
        category.category_name.toLowerCase().includes(searchTerm) // Filter categories based on search term
    );
    currentPage = 1; // Reset to the first page
    renderTable();    // Render the table with filtered categories
    setupPagination(); // Update pagination based on filtered results
});

// Function to render the table based on the current page
function renderTable() {
    $('#categoryTable').empty(); // Clear the existing table body if necessary

    if (filteredCategories.length === 0) {
        // Display no results message if there are no filtered categories
        $('#categoryTable').append('<tr><td colspan="4" class="text-center">No results found</td></tr>');
        return; // Exit the function if there are no categories to display
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCategories.length);

    for (let index = startIndex; index < endIndex; index++) {
        const category = filteredCategories[index];
        let row = `<tr>
            <th class="pb-3 pt-3" scope="row">${startIndex + index + 1}</th>
            <td class="pb-3 pt-3">${category.category_date}</td>
            <td class="pb-3 pt-3">${category.category_name}</td>
            <td class="pb-3 pt-3">
                <button class="delete-button" style="background: transparent; border: none" data-id="${category.id}">
                    <i class="bi bi-trash3"></i>
                </button>
                <button class="edit-button" style="background: transparent; border: none" data-id="${category.id}" data-name="${category.category_name}" data-date="${category.category_date}">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>`;
        
        $('#categoryTable').append(row);
    }

    // Add event listener for edit buttons
    $('.edit-button').off('click').on('click', function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const date = $(this).data('date');

        // Populate modal inputs
        $('#editModal input[name="categoryName"]').val(name);
        $('#editModal input[name="categoryId"]').val(id); // Assuming you have a hidden input for the ID

        // Show the modal
        $('#editModal').modal('show');
    });
}


// Function to set up pagination controls
function setupPagination() {
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage); // Calculate total pages
    const paginationContainer = $('#paginationControls'); // Use the new pagination container

    paginationContainer.empty(); // Clear existing pagination controls

    // Create Previous button
    const prevButton = `<li class="page-item page-pink${currentPage === 1 ? ' disabled' : ''}">
        <a class="page-link" href="#" id="prevPage">Previous</a>
    </li>`;
    paginationContainer.append(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = `<li class="page-item page-pink${currentPage === i ? ' active' : ''}">
            <a class="page-link page-number" href="#" data-page="${i}">${i}</a>
        </li>`;
        paginationContainer.append(pageButton);
    }

    // Create Next button
    const nextButton = `<li class="page-item page-pink${currentPage === totalPages ? ' disabled' : ''}">
        <a class="page-link" href="#" id="nextPage">Next</a>
    </li>`;
    paginationContainer.append(nextButton);

    // Attach event handlers for pagination buttons
    $('#prevPage').click(function(event) {
        event.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderTable(); // Re-render the table for the new page
            setupPagination(); // Update pagination controls
        }
    });

    $('#nextPage').click(function(event) {
        event.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderTable(); // Re-render the table for the new page
            setupPagination(); // Update pagination controls
        }
    });

    // Attach click event to page number buttons
    $('.page-number').off('click').on('click', function(event) {
        event.preventDefault();
        currentPage = parseInt($(this).data('page'));
        renderTable(); // Re-render the table for the new page
        setupPagination(); // Update pagination controls
    });
}

// Event listener for delete buttons
$(document).on('click', '.delete-button', function() {
    const categoryId = $(this).data('id'); // Get the ID from the button
    $('#confirmDelete').data('id', categoryId); // Store the ID in the confirm button
    $('#deleteModal').modal('show'); // Show the modal
});

// Event listener for the confirm delete button
$('#confirmDelete').click(function() {
    const categoryId = $(this).data('id'); // Get the ID from the button

    // Make an AJAX call to delete the category (adjust URL as needed)
    $.ajax({
        type: "DELETE",
        url: `/deleteCategory/${categoryId}`, // Ensure the endpoint is correct
        success: function(response) {
            console.log('Category deleted successfully');
            $('#deleteModal').modal('hide'); // Hide the modal
            fetchAndRenderCategories(); // Refresh the table and pagination
        },
        error: function(xhr, status, error) {
            console.error('Error deleting category:', error); // Handle errors
        }
    });
});

// Function to fetch and render categories after deletion
function fetchAndRenderCategories() {
    $.ajax({
        type: "GET",
        url: "/fetchAllCategories",
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            categories = response; // Store the fetched categories
            filteredCategories = categories; // Reset filtered categories
            renderTable(); // Render the updated table
            setupPagination(); // Setup pagination
        },
        error: function(xhr, status, error) {
            console.error('Error fetching categories:', error);
        }
    });
}
