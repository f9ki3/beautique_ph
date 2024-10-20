// Event listener for delete buttons
$(document).on('click', '.delete-button-category', function() {
    const categoryId = $(this).data('id'); // Get the ID from the button
    $('#confirmDelete').data('id', categoryId); // Store the ID in the confirm button
    $('#deleteModalCategory').modal('show'); // Show the modal
    // console.log('Click');
});

// Event listener for the confirm delete button
$(document).on('click', '#confirmDelete', function() {
    let categoryId = $(this).data('id'); // Get the ID from the confirm button
    // console.log('Click');
    data = {
        'id': categoryId
    }
    $('.del-category-text').hide()
    $('.del-category-load').show()
    // Make an AJAX call to delete the category (adjust URL as needed)
    $.ajax({
        type: "POST",
        url: "/deleteCategory",           // Ensure the endpoint is correct
        data: JSON.stringify(data),       // Convert the data object to a JSON string
        contentType: "application/json",  // Correct content type for sending JSON
        dataType: "json",                 // Expect JSON response from the server
        success: function (response) {
            console.log(response.status); 
            $('#deleteCategorySuccess').show()
            $('.category-text').show()
            $('.category-load').hide()
            setTimeout(() => {
                location.reload()
            }, 3000);
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);  // Handle any errors that occur during the request
            $('.category-text').show()
            $('.category-load').hide()
        }
    });
});
