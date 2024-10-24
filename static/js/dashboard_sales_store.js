$(document).ready(function() {
    // Function to fetch daily sales data and render the chart
    function fetchDailySalesData() {
        $.ajax({
            url: '/fetchSalesDashboards',  // Update with your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Extracting the store daily sales data
                var dailyStoreSales = response[0].store_daily_sales;
                var storeDates = dailyStoreSales.date;
                var storeSums = dailyStoreSales.sum;

                // Extracting the shopee daily sales data
                var dailyShopeeSales = response[2].shopee_daily_sales;
                var shopeeDates = dailyShopeeSales.date;
                var shopeeSums = dailyShopeeSales.sum;

                // Prepare categories and data for the chart (formatting the date)
                var chartCategories = [];
                var storeChartData = [];
                var shopeeChartData = [];

                // Process Store daily sales data
                for (var i = 0; i < storeDates.length; i++) {
                    if (storeDates[i]) {
                        var date = new Date(storeDates[i]);
                        var formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });  // Format dates
                        chartCategories.push(formattedDate);  // Add formatted dates
                        storeChartData.push(storeSums[i]);  // Add store sales sums
                    }
                }

                // Process Shopee daily sales data (ignore null dates)
                for (var i = 0; i < shopeeDates.length; i++) {
                    if (shopeeDates[i]) {
                        var date = new Date(shopeeDates[i]);
                        var formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });  // Format dates
                        if (!chartCategories.includes(formattedDate)) {
                            chartCategories.push(formattedDate);  // Only add if not already present
                        }
                        shopeeChartData.push(shopeeSums[i]);  // Add shopee sales sums
                    }
                }

                // Store and Shopee Daily Sales Chart Configuration
                var dailySalesOptions = {
                    series: [{
                        name: 'Store Daily Sales',
                        data: storeChartData // Store daily sales data
                    }, {
                        name: 'Shopee Daily Sales',
                        data: shopeeChartData // Shopee daily sales data
                    }],
                    chart: {
                        height: 350,
                        type: 'bar'
                    },
                    colors: ['#21eb1a', '#f98c14'], // Store and Shopee colors
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: chartCategories // Formatted dates
                    },
                    tooltip: {
                        x: {
                            format: 'dd MMM yyyy' // Adjust tooltip format for daily sales
                        }
                    }
                };

                // Initialize Daily Sales Chart
                var dailySalesChart = new ApexCharts(document.querySelector("#dailySalesChart"), dailySalesOptions);
                dailySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error("Error fetching daily sales data:", error);
            }
        });
    }

    // Function to fetch monthly sales data and update the chart
    function fetchMonthlySalesData() {
        $.ajax({
            url: '/fetchSalesDashboards', // Change this to your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Extracting the store monthly sales data
                var monthlyStoreSales = response[1].store_monthly_sales;
                var storeMonths = monthlyStoreSales.month;
                var storeSums = monthlyStoreSales.sum;

                // Extracting the shopee monthly sales data
                var monthlyShopeeSales = response[3].shopee_monthly_sales;
                var shopeeMonths = monthlyShopeeSales.month;
                var shopeeSums = monthlyShopeeSales.sum;

                // Prepare categories and data for the chart
                var chartCategories = [];
                var storeChartData = [];
                var shopeeChartData = [];

                // Process Store monthly sales data
                for (var i = 0; i < storeMonths.length; i++) {
                    if (storeMonths[i]) {
                        var date = new Date(storeMonths[i] + '-01'); // Append a day to create a valid date
                        var monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });  // Format to include year
                        if (!chartCategories.includes(monthYear)) {
                            chartCategories.push(monthYear);  // Avoid duplicate months
                        }
                        storeChartData.push(storeSums[i]);  // Add store sales sums
                    }
                }

                // Process Shopee monthly sales data
                for (var i = 0; i < shopeeMonths.length; i++) {
                    if (shopeeMonths[i]) {
                        var date = new Date(shopeeMonths[i] + '-01'); // Append a day to create a valid date
                        var monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });  // Format to include year
                        if (!chartCategories.includes(monthYear)) {
                            chartCategories.push(monthYear);  // Avoid duplicate months
                        }
                        shopeeChartData.push(shopeeSums[i]);  // Add shopee sales sums
                    }
                }

                // Store and Shopee Monthly Sales Chart Configuration
                var monthlySalesOptions = {
                    series: [{
                        name: 'Store Monthly Sales',
                        data: storeChartData // Store monthly sales data
                    }, {
                        name: 'Shopee Monthly Sales',
                        data: shopeeChartData // Shopee monthly sales data
                    }],
                    chart: {
                        height: 350,
                        type: 'area'
                    },
                    colors: ['#21eb1a', '#f98c14'], // Store and Shopee colors
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: chartCategories // Formatted month names with years
                    },
                    tooltip: {
                        x: {
                            format: 'MMMM yyyy' // Adjust tooltip format for monthly sales
                        }
                    }
                };

                // Initialize Monthly Sales Chart
                var monthlySalesChart = new ApexCharts(document.querySelector("#monthlySalesChart"), monthlySalesOptions);
                monthlySalesChart.render();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching monthly sales data:', error);
            }
        });
    }

    // Call the functions to fetch data and render the charts
    fetchDailySalesData();
    fetchMonthlySalesData();
});
