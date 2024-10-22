$(document).ready(function() {
    $('#insertCategory').on('click', function() {
        // Clear previous validation states
        $('.form-control').removeClass('is-invalid');

        // Validate form fields
        const fullname = $('#adminFullname').val().trim();
        const email = $('#adminEmail').val().trim();
        const username = $('#adminUsername').val().trim();
        const password = $('#adminPassword').val().trim();
        const confirmPassword = $('#adminConfirmPassword').val().trim();

        // Basic validation
        if (!fullname || !email || !username || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            if (!fullname) $('#adminFullname').addClass('is-invalid');
            if (!email) $('#adminEmail').addClass('is-invalid');
            if (!username) $('#adminUsername').addClass('is-invalid');
            if (!password) $('#adminPassword').addClass('is-invalid');
            if (!confirmPassword) $('#adminConfirmPassword').addClass('is-invalid');
            return;
        }

        // Validate email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            $('#adminEmail').addClass('is-invalid');
            return;
        }

        // Validate password strength (minimum 8 characters, at least one letter and one number)
        // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        // if (!passwordPattern.test(password)) {
        //     alert("Password must be at least 8 characters long and contain at least one letter and one number.");
        //     $('#adminPassword').addClass('is-invalid');
        //     return;
        // }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            $('#adminPassword, #adminConfirmPassword').addClass('is-invalid');
            return;
        }

        // Show loading indicator
        $('.category-load').show();
        $('.category-text').hide();

        // Prepare data to send
        const data = {
            full_name: fullname,
            email: email,
            username: username,
            password: password
        };

        // Send data to the server
        $.ajax({
            type: "POST",
            url: "/createAdminAccount", // Your endpoint to handle the request
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function(response) {
                if (response.success) {
                    $('#addCategorySuccess').show(); // Show success alert
                    setTimeout(() => {
                        location.reload(); // Optionally reload the page
                    }, 1500);
                } else {
                    alert(response.message || "Failed to add admin account.");
                    location.reload()
                }
            },
            error: function(xhr) {
                console.error('Error:', xhr.responseText);
                alert("Error adding admin account: " + (xhr.responseJSON?.error || xhr.responseText));
            },
            complete: function() {
                // Hide loading indicator
                $('.category-load').hide();
                $('.category-text').show();
            }
        });
    });
});
