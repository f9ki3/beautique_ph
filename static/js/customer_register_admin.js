$(document).ready(function() {
    $('#adminRegisterCustomer').click(function() {
        // Reset validation
        $('.form-control').removeClass('is-invalid');

        // Collect all data
        let firstname = $('#adminFirstname').val().trim();
        let lastname = $('#adminLastname').val().trim();
        let email = $('#adminEmail').val().trim();
        let username = $('#adminUsername').val().trim();
        let address = $('#adminAddress').val().trim();
        let password = $('#adminPassword').val().trim();
        let confirmPassword = $('#adminConfirmPassword').val().trim();

        let isValid = true;

        // Validation
        if (!firstname) {
            $('#adminFirstname').addClass('is-invalid');
            isValid = false;
        }

        if (!lastname) {
            $('#adminLastname').addClass('is-invalid');
            isValid = false;
        }

        if (!email || !validateEmail(email)) {
            $('#adminEmail').addClass('is-invalid');
            isValid = false;
        }

        if (!username) {
            $('#adminUsername').addClass('is-invalid');
            isValid = false;
        }

        if (!address) {
            $('#adminAddress').addClass('is-invalid');
            isValid = false;
        }

        if (!password) {
            $('#adminPassword').addClass('is-invalid');
            isValid = false;
        }

        if (password !== confirmPassword) {
            $('#adminConfirmPassword').addClass('is-invalid');
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
                    window.location.href="/admin-customer-accounts";
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