// Ensure document is ready before running the script
$(document).ready(function() {
    // Attach click event to the login button
    $("#customerLoginBtn").click(handleCustomerLogin);

    // Attach keydown event to the input fields
    $("#customerEmail, #customerPassword").keydown(function(event) {
        if (event.key === "Enter") {
            handleCustomerLogin();
        }
    });

    function handleCustomerLogin() {
        $('.customer-login-load').show();
        $('.customer-login-text').hide();

        // Get the email and password values
        var email = $("#customerEmail").val();
        var password = $("#customerPassword").val();

        // Send a POST request to the Flask endpoint
        setTimeout(() => {
            $.ajax({
                type: "POST",
                url: "/post_login_customer",  // Flask endpoint
                contentType: "application/json",
                data: JSON.stringify({ email: email, password: password }),
                success: function(response) {
                    let output = response.status;
                    console.log(output);
    
                    if (output === 1) {
                        window.location.href = "/customer_landing";  // Navigate to dashboard
                        $('.customer-login-load').hide();
                        $('.customer-login-text').show();
                    } else {
                        $('.login-customer-failed').show();
                        $('#customerEmail').addClass('is-invalid');
                        $('#customerPassword').addClass('is-invalid');
                        $('.customer-login-load').hide();
                        $('.customer-login-text').show();
                    }
                },
                error: function(xhr, status, error) {
                    // Handle error response
                    console.error("Login failed:", error);
                }
            });
        }, 3000);
    }
});