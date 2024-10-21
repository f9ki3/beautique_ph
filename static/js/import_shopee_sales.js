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
            // Close the modal after success
            $('#addStocks').modal('hide');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error uploading CSV file: ' + errorThrown);
            // Hide loading spinner
            $('.category-load').hide();
        }
    });
}