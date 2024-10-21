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
