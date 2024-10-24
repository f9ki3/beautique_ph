// Fetch all categories
$.ajax({
    type: "GET",
    url: "/fetchAllCategories",  // Ensure this endpoint is set up correctly
    contentType: "application/json", // This is fine for GET requests
    dataType: "json",
    success: function(response) {
        // Assuming 'response' is an array of categories
        const categories = response;

        // Populate the main category select element
        const $mainSelect = $('#selectMainCategories');
        $mainSelect.empty();  // Clear existing options

        categories.forEach(function(category) {
            const option = $('<option></option>')
                .attr('value', category.id)  // Set the value to category ID
                .text(category.category_name); // Set the text to category name
            $mainSelect.append(option);
        });

        // Populate the link category select element
        const $linkSelect = $('#selectLinkCategories');
        $linkSelect.empty();  // Clear existing options

        categories.forEach(function(category) {
            const option = $('<option></option>')
                .attr('value', category.id)  // Set the value to category ID
                .text(category.category_name); // Set the text to category name
            $linkSelect.append(option);
        });
    },
    error: function(xhr, status, error) {
        console.error('Error fetching categories:', error);
    }
});

// Function to handle the insertion of the rule
function insertRule() {
    // Get selected category IDs
    const mainCategoryId = $('#selectMainCategories').val();
    const linkCategoryId = $('#selectLinkCategories').val();

    // AJAX request to send selected IDs to the server
    $.ajax({
        type: "POST",
        url: "/addRule",  // Ensure this endpoint is set up for adding rules
        contentType: "application/json",
        data: JSON.stringify({
            main_category_id: mainCategoryId,
            link_category_id: linkCategoryId
        }),
        success: function(response) {
            // Show success message
            $('#addCategorySuccess').show();
            // Optionally: Hide the message after a few seconds
            setTimeout(() => {
                $('#addCategorySuccess').fadeOut();
                location.reload()
            }, 3000);
        },
        error: function(xhr, status, error) {
            alert('Already added the rule')
            console.error('Error adding rule:', error);
        }
    });
}