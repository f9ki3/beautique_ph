const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('product_id');

// Check if productId is not valid
if (!productId) {
    // console.log('No valid product_id found in the URL.'); // Optional: log or handle as needed
    // Exit the script by returning or not executing further code
} else {
    // Example AJAX request
    $.ajax({
        url: '/get_product', // Replace with your API endpoint
        method: 'GET', // or 'POST' depending on your needs
        data: {
            product_id: productId // Pass the product ID as data
        },
        success: function(response) {
            const price = parseFloat(response.price);
            const formattedPrice = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'PHP'
            }).format(price);

            console.log('Success:', response); // Handle successful response
            $('#product_name').text(response.product_name);
            $('#product_price').text(formattedPrice);
            $('#product_category').text("Category: " + response.category_name);
            $('#product_description').text(response.description);
            $('#product_stocks').text("Stocks: " + response.stocks); // Adjusted to show stock info

            const sizes = response.sizes;
            const colors = response.colors; // Get the colors from the response

            // Split the sizes string by commas
            const sizesArray = sizes.split(",");

            // Create a container for the size buttons
            const sizeButtonContainer = document.createElement('div');
            let selectedSize = null; // Track the selected size

            // Populate buttons for each size
            sizesArray.forEach(size => {
                const button = document.createElement('button');
                button.className = 'btn btn-light border mt-2 me-2';
                button.textContent = size.trim(); // Trim to remove extra spaces
                
                // Add click event for selecting size
                button.addEventListener('click', function() {
                    if (selectedSize) {
                        selectedSize.classList.remove('btn-pink'); // Remove active class from previous button
                        selectedSize.classList.add('btn-light'); // Reset to original
                    }
                    selectedSize = button; // Update selected size
                    button.classList.remove('btn-light'); // Reset original class
                    button.classList.add('btn-pink'); // Add active class
                });

                sizeButtonContainer.appendChild(button);
            });

            // Append the size button container to the element with id "btn_sizes"
            const btnSizesElement = document.getElementById('btn_sizes');
            if (btnSizesElement) {
                btnSizesElement.appendChild(sizeButtonContainer); // Append the size buttons
            } else {
                console.error('Element with id "btn_sizes" not found.');
            }

            // Split the colors string by commas
            const colorsArray = colors.split(",");

            // Create a container for the color buttons
            const colorButtonContainer = document.createElement('div');
            let selectedColor = null; // Track the selected color

            // Populate buttons for each color
            colorsArray.forEach(color => {
                const button = document.createElement('button');
                button.className = 'btn btn-light border mt-2 me-2'; // Initial class
                button.textContent = color.trim(); // Trim to remove extra spaces
                
                // Add click event for selecting color
                button.addEventListener('click', function() {
                    if (selectedColor) {
                        selectedColor.classList.remove('btn-pink'); // Remove active class from previous button
                        selectedColor.classList.add('btn-light'); // Reset to original
                    }
                    selectedColor = button; // Update selected color
                    button.classList.remove('btn-light'); // Reset original class
                    button.classList.add('btn-pink'); // Add active class
                });

                colorButtonContainer.appendChild(button);
            });

            // Append the color button container to the desired location in your HTML
            const btnColorsElement = document.getElementById('btn_colors'); // Change this to the appropriate element ID
            if (btnColorsElement) {
                btnColorsElement.appendChild(colorButtonContainer); // Append the color buttons
            } else {
                console.error('Element with id "btn_colors" not found.');
            }

            // image ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
            const images = response.product_image; // Get the colors from the response

            // Split the sizes string by commas
            const imagesArray = images.split(",");

            // Get the image preview container
            const imagePreviewContainer = document.getElementById("image_preview");
            const viewImage = document.getElementById("view_image"); // Get the view image element

            // Clear any existing content
            imagePreviewContainer.innerHTML = "";

            // Loop through the images array and create a div for each image
            imagesArray.forEach((image, index) => {
                const imageDiv = document.createElement("div");
                imageDiv.className = "border rounded mt-2 me-2";
                imageDiv.style.width = "70px";
                imageDiv.style.height = "70px";
                imageDiv.style.cursor = "pointer"; // Change cursor to pointer

                const img = document.createElement("img");
                img.className = "object-fit-cover rounded w-100 h-100";
                img.src = `../static/uploads/${image.trim()}`; // Prefix with static/uploads/
                img.alt = "list of product";

                // Add a click event listener to the image div
                imageDiv.addEventListener("click", () => {
                    viewImage.src = img.src; // Set the src of the view image to the clicked image's src
                });

                // Append the img to the div
                imageDiv.appendChild(img);

                // Append the div to the image preview container
                imagePreviewContainer.appendChild(imageDiv);

                // Display the first image by default
                if (index === 0) {
                    viewImage.src = img.src; // Set the view image to the first image's src
                }
            });

            const viewCategoryId = response.category_id

            $.ajax({
                type: "GET",
                url: `/fetchAllProductsCategory?category_id=${viewCategoryId}`, // Include category_id in the URL
                contentType: "application/json",
                dataType: "json",
                success: function(response) {
                    var productList = $('#productListCategory'); // Get the element where you want to add products
                    productList.empty(); // Clear any existing content
        
                    // Iterate through the response and create product cards
                    response.forEach(function(product) {
                        var productHTML = `
                            <div class="col-6 col-md-3">
                                <a href="product_view?product_id=${product.id}" style="text-decoration: none; color: inherit;">
                                    <div class="p-3">
                                        <div style="position: relative;">
                                            <div style="width: 100%; height: 200px;">
                                                <img style="object-fit: cover; width: 100%; height: 100%;" class="rounded" src="../static/uploads/${product.product_image.split(',')[0].trim()}" alt="">
                                                <button style="position: absolute; right: 10px; bottom: 10px;" class="btn border btn-pink rounded-5">
                                                    <i class="bi bi-cart-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <p class="mb-0">${product.product_name.substring(0, 66)}...</p>
                                        <h6 class="fw-bolder mt-0">₱ ${product.price.toFixed(2)} PHP</h6>
                                    </div>
                                </a>
                            </div>`;
        
                        productList.append(productHTML); // Append each product card to the productList div
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);  // Handle any errors that occur during the request
                    $('.category-text').show();
                    $('.category-load').hide();
                }
            });
        },
        error: function(xhr, status, error) {
            console.error('Error:', error); // Handle error
        }
    });
}
