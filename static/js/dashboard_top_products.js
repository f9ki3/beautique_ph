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
            var dataTop = response.top_products;
            var dataBottom = response.bottoms_products;

            // Function to generate star icons based on rating
            function generateStars(rating, isTopRank) {
                let stars = '';
                for (let i = 0; i < 5; i++) {
                    if (i < rating) {
                        // Filled star icon with color based on top rank status
                        stars += `<i class="bi bi-star-fill" style="color: ${isTopRank ? '#FFD700' : '#3498DB'};"></i>`;
                    } else {
                        // Empty star icon
                        stars += `<i class="bi bi-star" style="color: #ccc;"></i>`;
                    }
                }
                return stars;
            }

            // Append top products to the topProductsShopee table
            if (Array.isArray(dataTop)) {
                var topTableBody = $('#topProductsShopee');
                
                dataTop.forEach(function(item, index) {
                    var isTopRank = index === 0;  // Check if it's the top-ranked product
                    
                    var topProductRow = `
                        <tr>
                            <td>${index + 1}</td>  <!-- Rank (1-based index) -->
                            <td>${item.product_name}</td>  <!-- Product Name -->
                            <td>${item.total_quantity}</td>  <!-- Number of Sales -->
                            <td>${generateStars(item.rating, isTopRank)}</td>  <!-- Star Rating with color -->
                        </tr>
                    `;
                    topTableBody.append(topProductRow);
                });
            } else {
                console.error('Top Products data is not an array:', dataTop);
            }

            // Append bottom products to the bottomsProductsShopee table
            if (Array.isArray(dataBottom)) {
                var bottomTableBody = $('#bottomsProductsShopee');
                
                dataBottom.forEach(function(item, index) {
                    var bottomProductRow = `
                        <tr>
                            <td>${index + 1}</td>  <!-- Rank (1-based index) -->
                            <td>${item.product_name}</td>  <!-- Product Name -->
                            <td>${item.total_quantity}</td>  <!-- Number of Sales -->
                            <td>${generateStars(item.rating, false)}</td>  <!-- Star Rating without top-rank coloring -->
                        </tr>
                    `;
                    bottomTableBody.append(bottomProductRow);
                });
            } else {
                console.error('Bottom Products data is not an array:', dataBottom);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
            console.log(xhr.responseText); // Log the response text for more context
        }
    });
});
