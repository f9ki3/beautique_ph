let currentAdminCount = null;
let currentCustomerCount = null;
let currentTotalSalesToday = null;
let currentTotalSalesMonth = null;

function formatCurrency(amount) {
    // Convert to float, format with commas, and prepend the peso sign
    return `₱${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function fetchCounts() {
    $.ajax({
        type: "GET",
        url: "/fetchCountAccounts", // Endpoint to fetch all counts and sales
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            const newAdminCount = response.admin_count;
            const newCustomerCount = response.customer_count;
            const total_sales_month = response.total_sales_month;
            const total_sales_today = response.total_sales_today;

            // Only update the DOM if the data has changed
            if (newAdminCount !== currentAdminCount) {
                $('#admin_count').text(newAdminCount);
                currentAdminCount = newAdminCount;
            }

            if (newCustomerCount !== currentCustomerCount) {
                $('#customer_count').text(newCustomerCount);
                currentCustomerCount = newCustomerCount;
            }

            // Update total sales today if changed
            if (total_sales_today !== currentTotalSalesToday) {
                $('#sales_today').text(formatCurrency(total_sales_today)); // Format as currency
                currentTotalSalesToday = total_sales_today;
            }

            // Update total sales for the month if changed
            if (total_sales_month !== currentTotalSalesMonth) {
                $('#sales_month').text(formatCurrency(total_sales_month)); // Format as currency
                currentTotalSalesMonth = total_sales_month;
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching counts:', error);
        }
    });
}

// Poll every 5 seconds (5000 milliseconds)
setInterval(fetchCounts, 5000);

// Initial fetch when the page loads
fetchCounts();
