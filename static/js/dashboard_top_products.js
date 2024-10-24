// $(document).ready(function() {
//     $.ajax({
//         url: '/fetchTopProducts',  // Replace with your API endpoint
//         method: 'GET',
//         dataType: 'json',
//         success: function(response) {
//             // Log the received response to the console for debugging
//             console.log(response);
            
//             // Access the data array from the response
//             var data = response.top_products;
            
//             // Check if the data is an array before mapping
//             if (Array.isArray(data)) {
//                 var seriesData = data.map(function(item) {
//                     return {
//                         x: item.product_name,  // Product name as the category
//                         y: item.total_quantity  // Use total_quantity for the treemap size
//                     };
//                 });

//                 // Define the options for the treemap
//                 var options = {
//                     series: [{
//                         data: seriesData  // Use the formatted series data for the treemap
//                     }],
//                     chart: {
//                         height: 350,
//                         type: 'treemap'  // Change to treemap chart
//                     },
//                     title: {
//                         text: 'Top Shopee Sales Products Treemap',
//                         align: 'center'
//                     },
//                     colors: [
//                         '#27AE60',  // Forest Green
//                         '#2ECC71',  // Lime Green
//                         '#3498DB',  // Blue Sky
//                         '#F1C40F',  // Sunflower Yellow
//                         '#E67E22',  // Soft Orange
//                         '#E74C3C',  // Warm Red
//                         '#16A085',  // Dark Teal
//                         '#F39C12',  // Orange
//                         '#8E44AD',  // Deep Purple
//                         '#2C3E50'   // Charcoal
//                     ],
//                     legend: {
//                         show: false  // Treemaps typically do not need legends
//                     },
//                     tooltip: {
//                         y: {
//                             formatter: function(val) {
//                                 return val + " units sold";  // Display the quantity sold on hover
//                             }
//                         }
//                     }
//                 };

//                 // Render the treemap with the populated options
//                 var topProductsTreemap = new ApexCharts(document.querySelector("#topProductsShopee"), options);
//                 topProductsTreemap.render();
//             } else {
//                 console.error('Data is not an array:', data);
//             }
//         },
//         error: function(xhr, status, error) {
//             console.error('Error fetching data:', error);
//             console.log(xhr.responseText); // Log the response text for more context
//         }
//     });
// });
$(document).ready(function() {
    $.ajax({
        url: '/fetchTopProducts',  // Replace with your API endpoint
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            // Log the received response to the console for debugging
            console.log(response);
            
            // Access the data arrays from the response
            var shopeeTop = response.shopee_top_products;
            var shopeeBottom = response.shopee_bottom_products;
            var storeTop = response.store_top_products;
            var storeBottom = response.store_bottom_products;

            // Function to generate star icons based on rating and popularity
            function generateStars(totalSales) {
                let stars = '';
                let adjustedRating = Math.max(0, Math.min(Math.floor(totalSales / 10), 5)); // Adjusted rating based on sales

                for (let i = 0; i < 5; i++) {
                    if (i < adjustedRating) {
                        // Filled star icon in orange
                        stars += `<i class="bi bi-star-fill" style="color: orange;"></i>`;
                    } else {
                        // Empty star icon
                        stars += `<i class="bi bi-star" style="color: #ccc;"></i>`;
                    }
                }
                return stars;
            }

            // Append Shopee top products to the topProductsShopee table
            if (Array.isArray(shopeeTop)) {
                var topTableShopee = $('#topProductsShopee');
                topTableShopee.empty(); // Clear the table before appending new data
                
                shopeeTop.forEach(function(item, index) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>  <!-- Rank (1-based index) -->
                            <td>${item.product_name}</td>  <!-- Product Name -->
                            <td>${item.total_quantity}</td>  <!-- Number of Sales -->
                            <td>${generateStars(item.total_quantity)}</td>  <!-- Star Rating -->
                        </tr>
                    `;
                    topTableShopee.append(row);
                });
            } else {
                console.error('Shopee Top Products data is not an array:', shopeeTop);
            }

            // Append Shopee bottom products to the bottomsProductsShopee table
            if (Array.isArray(shopeeBottom)) {
                var bottomTableShopee = $('#bottomsProductsShopee');
                bottomTableShopee.empty(); // Clear the table before appending new data
                
                shopeeBottom.forEach(function(item, index) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>  <!-- Rank (1-based index) -->
                            <td>${item.product_name}</td>  <!-- Product Name -->
                            <td>${item.total_quantity}</td>  <!-- Number of Sales -->
                            <td>${generateStars(item.total_quantity)}</td>  <!-- Star Rating -->
                        </tr>
                    `;
                    bottomTableShopee.append(row);
                });
            } else {
                console.error('Shopee Bottom Products data is not an array:', shopeeBottom);
            }

            // Append Store top products to the topProductsStore table
            if (Array.isArray(storeTop)) {
                var topTableStore = $('#topProductsStore');
                topTableStore.empty(); // Clear the table before appending new data
                
                storeTop.forEach(function(item, index) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>  <!-- Rank (1-based index) -->
                            <td>${item.product_name}</td>  <!-- Product Name -->
                            <td>${item.total_quantity}</td>  <!-- Number of Sales -->
                            <td>${generateStars(item.total_quantity)}</td>  <!-- Star Rating -->
                        </tr>
                    `;
                    topTableStore.append(row);
                });
            } else {
                console.error('Store Top Products data is not an array:', storeTop);
            }

            // Append Store bottom products to the bottomsProductsStore table
            if (Array.isArray(storeBottom)) {
                var bottomTableStore = $('#bottomsProductsStore');
                bottomTableStore.empty(); // Clear the table before appending new data
                
                storeBottom.forEach(function(item, index) {
                    var row = `
                        <tr>
                            <td>${index + 1}</td>  <!-- Rank (1-based index) -->
                            <td>${item.product_name}</td>  <!-- Product Name -->
                            <td>${item.total_quantity}</td>  <!-- Number of Sales -->
                            <td>${generateStars(item.total_quantity)}</td>  <!-- Star Rating -->
                        </tr>
                    `;
                    bottomTableStore.append(row);
                });
            } else {
                console.error('Store Bottom Products data is not an array:', storeBottom);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
            console.log(xhr.responseText); // Log the response text for more context
        }
    });
});
