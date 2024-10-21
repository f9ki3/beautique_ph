
$(document).ready(function() {
    $('#update_profile_btn').on('click', function() {
        // Enable the input fields
        $('#cart_fname, #cart_lname, #cart_email, #cart_address').prop('disabled', false);
        
        // Show the update profile options
        $('#update_profile').show();
    });

    $('#submit_update').on('click', function() {
        // Collect data from the input fields
        const profileData = {
            first_name: $('#cart_fname').val(),
            last_name: $('#cart_lname').val(),
            email: $('#cart_email').val(),
            address: $('#cart_address').val()
        };

        // Send data to the Flask endpoint
        $.ajax({
            url: '/update_profile', // Replace with your Flask endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(profileData),
            success: function(response) {
                // Handle success response
                alert('Profile updated successfully!');
                console.log(response);
                location.reload()
            },
            error: function(xhr, status, error) {
                // Handle error response
                alert('Error updating profile: ' + error);
                console.log(xhr.responseText);
            }
        });
    });

    // Optional: Handle cancel button to hide update options and disable fields
    $('#cancel_btn').on('click', function() {
        $('#update_profile').hide();
        $('#cart_fname, #cart_lname, #cart_email, #cart_address').prop('disabled', true).val('');
    });
});