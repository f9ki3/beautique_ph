function insertStock() {
    var fileInput = document.getElementById('csvFile');
    var file = fileInput.files[0]; // Get the file

    if (!file) {
        alert('Please select a CSV file to upload.');
        return;
    }

    var formData = new FormData();
    formData.append('csv_file', file); // Append the file to the form data

    // Show loading spinner
    $('.category-load').show();
    $('.category-text').hide();

    $.ajax({
        url: '/upload_csv', // Flask endpoint for handling CSV upload
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            alert('CSV file uploaded successfully!');
            // Hide loading spinner
            $('.category-load').hide();
            $('.category-text').show();
            // Close the modal after success
            location.reload()
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('File Already uploaded!');
            // Hide loading spinner
            $('.category-load').hide();
            $('.category-text').show();
            location.reload()
        }
    });
}