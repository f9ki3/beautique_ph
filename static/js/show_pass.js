function togglePasswordVisibility() {
    const passwordInput = document.getElementById('customerPassword');
    const button = document.getElementById('button-addon2');

    // Toggle the input type between password and text
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.textContent = 'Hide'; // Change button text to 'Hide'
    } else {
        passwordInput.type = 'password';
        button.textContent = 'Show'; // Change button text back to 'Show'
    }
}

function togglePasswordVisibilitys() {
    const passwordInput = document.getElementById('password');
    const button = document.getElementById('button-addon2');

    // Toggle the input type between password and text
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        button.textContent = 'Hide'; // Change button text to 'Hide'
    } else {
        passwordInput.type = 'password';
        button.textContent = 'Show'; // Change button text back to 'Show'
    }
}

$(document).ready(function() {
    $('#button-addon3').on('click', function() {
        const passwordInput = $('#password');
        const isPasswordVisible = passwordInput.attr('type') === 'text';

        // Toggle the input type
        passwordInput.attr('type', isPasswordVisible ? 'password' : 'text');

        // Toggle button text
        $(this).text(isPasswordVisible ? 'Show' : 'Hide');
    });
});

