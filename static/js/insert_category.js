function insertCategory(){
    // console.log('clicked!');
    
    // Get the value from the input field
    let categoryName = $('#addCategoryName').val();

    // Create a data object to send to the server
    let data = {
        'categoryName': categoryName
    };

    $('.category-text').hide()
    $('.category-load').show()
    // Perform the AJAX request
    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/insertCategory",           // Ensure the endpoint is correct
            data: JSON.stringify(data),       // Convert the data object to a JSON string
            contentType: "application/json",  // Correct content type for sending JSON
            dataType: "json",                 // Expect JSON response from the server
            success: function (response) {
                console.log(response.category); 
                $('#addCategorySuccess').show()
                $('.category-text').show()
                $('.category-load').hide()
                setTimeout(() => {
                    location.reload()
                }, 2000);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);  // Handle any errors that occur during the request
                $('.category-text').show()
                $('.category-load').hide()
            }
        });
    }, 2000);
}

$(document).ready(function() {
    $('#addCategoryName').on('input', function() {
        var inputValue = $(this).val().trim(); // Get the input value and trim white spaces
        if (inputValue === '') {
            $('#insertCategory').prop('disabled', true); // Disable button if input is empty
        } else {
            $('#insertCategory').prop('disabled', false); // Enable button if input has text
        }
    });
});
