$(document).ready(function() {
    $('#registerBtn').click(function() {
        // Reset validation
        $('.form-control').removeClass('is-invalid');

        // Collect all data
        let firstname = $('#firstname').val().trim();
        let lastname = $('#lastname').val().trim();
        let email = $('#email').val().trim();
        let username = $('#username').val().trim();
        let address = $('#address').val().trim();
        let password = $('#password').val().trim();
        let confirmPassword = $('#confirmPassword').val().trim();

        let isValid = true;

        // Validation
        if (!firstname) {
            $('#firstname').addClass('is-invalid');
            isValid = false;
        }

        if (!lastname) {
            $('#lastname').addClass('is-invalid');
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            $('#email').addClass('is-invalid');
            isValid = false;
        }

        if (!username) {
            $('#username').addClass('is-invalid');
            isValid = false;
        }

        if (!address) {
            $('#address').addClass('is-invalid');
            isValid = false;
        }

        if (!password) {
            $('#password').addClass('is-invalid');
            isValid = false;
        }

        if (password !== confirmPassword) {
            $('#confirmPassword').addClass('is-invalid');
            isValid = false;
        }

        // If form is valid, send data via AJAX request
        if (isValid) {
            // Create data object to send
            let formData = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                username: username,
                address: address,
                password: password
            };

            // Send the AJAX request to Flask
            $.ajax({
                url: '/post_customer_register',  // The endpoint in Flask
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(formData),  // Convert the form data to JSON
                success: function(response) {
                    // Handle success response (e.g., show success message)
                    window.location.href="/register_completed"
                },
                error: function(xhr, status, error) {
                    // Handle error response
                    alert('Registration failed: ' + xhr.responseJSON.message);
                }
            });
        }
    });

    // Email validation function
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});
