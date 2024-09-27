// Ensure document is ready before running the script
$(document).ready(function() {
    // Attach click event to the login button
    $("#loginBtn").click(handleLogin);

    // Attach keydown event to the input fields
    $("#email, #password").keydown(function(event) {
        if (event.key === "Enter") {
            handleLogin();
        }
    });

    function handleLogin() {
        $('.login-load').show()
        $('.login-text').hide()
        // Get the email and password values
        var email = $("#email").val();
        var password = $("#password").val();

        // Send a POST request to the Flask endpoint
        setTimeout(() => {
            $.ajax({
                type: "POST",
                url: "/post_login",  // Flask endpoint
                contentType: "application/json",
                data: JSON.stringify({ email: email, password: password }),
                success: function(response) {
                    let output = response.status;
                    console.log(output);
    
                    if (output === 1) {
                        window.location.href = "/admin-dashboard";  // Navigate to dashboard
                        $('.login-load').hide()
                        $('.login-text').show()
                    } else {
                        $('.login-admin-failed').show();
                        $('#email').addClass('is-invalid');
                        $('#password').addClass('is-invalid');
                        $('.login-load').hide()
                        $('.login-text').show()
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
