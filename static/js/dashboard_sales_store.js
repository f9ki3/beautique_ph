$(document).ready(function() {
    // Function to fetch daily sales data and render the chart
    function fetchDailySalesData() {
        $.ajax({
            url: '/fetchSalesDashboards',  // Update with your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // console.log(response); // Log the response to verify its structure
                // Extracting the daily sales data
                var dailySalesData = response[0].daily_sales;
                var dates = dailySalesData.date;
                var sums = dailySalesData.sum;

                // Prepare categories and data for the chart
                var chartCategories = [];
                var chartData = [];

                for (var i = 0; i < dates.length; i++) {
                    chartCategories.push(dates[i]);  // Add dates
                    chartData.push(sums[i]);  // Add corresponding sums
                }

                // Store Daily Sales Chart Configuration
                var storeDailySalesOptions = {
                    series: [{
                        name: 'Daily Sales',
                        data: chartData // Update with the fetched sales data
                    }],
                    chart: {
                        height: 350,
                        type: 'area'
                    },
                    colors: ['#21eb1a'], // Change the color here
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'smooth'
                    },
                    xaxis: {
                        type: 'datetime',
                        categories: chartCategories // Update with the fetched categories
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy'
                        }
                    }
                };

                // Initialize Store Daily Sales Chart
                var storeDailySalesChart = new ApexCharts(document.querySelector("#storeDailySales"), storeDailySalesOptions);
                storeDailySalesChart.render();
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
                // console.log(response); // Log the response to verify its structure
                // Assuming the response is in the specified format
                const monthlySales = response[1].monthly_sales; // Adjust the index if needed
                const months = monthlySales.month; // Array of month strings (e.g., ["2024-10"])
                const sums = monthlySales.sum; // Array of sums corresponding to the months

                // Update the chart options
                var storeMonthlySalesOptions = {
                    series: [{
                        name: 'Monthly Sales',
                        data: sums // Update with the fetched monthly sums
                    }],
                    chart: {
                        height: 350,
                        type: 'bar'
                    },
                    colors: ['#21eb1a'], // Change the color here
                    dataLabels: {
                        enabled: false
                    },
                    xaxis: {
                        categories: months // Set categories to months
                    },
                    tooltip: {
                        x: {
                            format: 'MMMM yyyy' // Adjust format as needed
                        }
                    }
                };

                // Initialize Store Monthly Sales Chart
                var storeMonthlySalesChart = new ApexCharts(document.querySelector("#storeMonthlySales"), storeMonthlySalesOptions);
                storeMonthlySalesChart.render();
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