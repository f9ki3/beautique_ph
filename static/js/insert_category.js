function insertCategory(){
    // console.log('clicked!');
    
    // Get the value from the input field
    let categoryName = $('#addCategoryName').val();

    // Create a data object to send to the server
    let data = {
        'categoryName': categoryName
    };

    // Perform the AJAX request
    $.ajax({
        type: "POST",
        url: "/insertCategory",           // Ensure the endpoint is correct
        data: JSON.stringify(data),       // Convert the data object to a JSON string
        contentType: "application/json",  // Correct content type for sending JSON
        dataType: "json",                 // Expect JSON response from the server
        success: function (response) {
            console.log(response.category);  // Log the category field from the response
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);  // Handle any errors that occur during the request
        }
    });
}
