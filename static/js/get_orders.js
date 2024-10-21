$(document).ready(function() {
    var currentPage = 1; // Track the current page
    var itemsPerPage = 5; // Number of orders to display per page
    var orders = []; // Array to hold all orders

    function fetchOrders() {
        $.ajax({
            url: '/get_orders', // Get all orders
            type: 'GET',
            dataType: 'json', // Expect JSON response
            success: function(response) {
                orders = response.orders; // Store all orders in an array
                updateOrdersTable(); // Initially display the first page
                updatePageInfo();
                updatePaginationControls();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching orders:', error);
            }
        });
    }

    function updateOrdersTable() {
        var ordersTable = $('#my_orders');
        ordersTable.empty(); // Clear table before appending new data

        // Calculate start and end index for current page
        var start = (currentPage - 1) * itemsPerPage;
        var end = start + itemsPerPage;
        var paginatedOrders = orders.slice(start, end); // Get the current page orders

        if (paginatedOrders.length === 0) {
            ordersTable.append('<tr><td colspan="5">No orders found.</td></tr>');
        } else {
            // Loop through each order and append a new row to the table
            $.each(paginatedOrders, function(index, order) {
                var orderRow = '<tr>' +
                    '<td class="pt-4 pb-4">ORDER00' + order.id + '</td>' +
                    '<td class="pt-4 pb-4">' + order.created_at + '</td>' +
                    '<td class="pt-4 pb-4">₱' + order.subtotal.toFixed(2) + '</td>' +
                    '<td class="pt-4 pb-4">₱' + order.vat.toFixed(2) + '</td>' +
                    '<td class="pt-4 pb-4">₱' + order.total.toFixed(2) + '</td>' +
                    '</tr>';
                ordersTable.append(orderRow);
            });
        }
    }

    function updatePageInfo() {
        $('#page-info').text('Total Orders: ' + orders.length);
    }

    function updatePaginationControls() {
        $('#previous-page').prop('disabled', currentPage === 1); // Disable previous button if on first page
        $('#next-page').prop('disabled', currentPage * itemsPerPage >= orders.length); // Disable next button if on last page
    }

    // Initialize pagination controls
    $('#previous-page').click(function() {
        if (currentPage > 1) {
            currentPage--;
            updateOrdersTable(); // Update table to show new page
            updatePaginationControls();
        }
    });

    $('#next-page').click(function() {
        if (currentPage * itemsPerPage < orders.length) {
            currentPage++;
            updateOrdersTable(); // Update table to show new page
            updatePaginationControls();
        }
    });

    // Initial order fetch
    fetchOrders();
});
