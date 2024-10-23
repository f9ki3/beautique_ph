function updateCategory() {
    const id = $('#categoryId').val()
    const name = $('#categoryName').val()
    const date = $('#categoryDate').val()

    data = {
        'id': id,
        'name': name,
        'date': date
    }

    $('.up-category-text').hide()
    $('.up-category-load').show()

    setTimeout(() => {
        $.ajax({
            type: "POST",
            url: "/updateCategory",           // Ensure the endpoint is correct
            data: JSON.stringify(data),       // Convert the data object to a JSON string
            contentType: "application/json",  // Correct content type for sending JSON
            dataType: "json",                 // Expect JSON response from the server
            success: function (response) {
                console.log(response.category); 
                $('#updateCategorySuccess').show()
                $('.up-category-text').show()
                $('.up-category-load').hide()
                setTimeout(() => {
                    location.reload()
                }, 2000);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);  // Handle any errors that occur during the request
                $('.up-category-text').show()
                $('.up-category-load').hide()
            }
        });
    }, 2000);
}