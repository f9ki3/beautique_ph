$(document).ready(function() {
    // Function to fetch daily sales data and render the chart
    let dailySalesChart; // Declare the chart variable globally

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
                var dailyShopeeSales = response[3].shopee_daily_sales;
                var shopeeDates = dailyShopeeSales.date;
                var shopeeSums = dailyShopeeSales.sum;

                // Prepare categories and data for the chart (formatting the date)
                var chartCategories = [];
                var storeChartData = [];
                var shopeeChartData = [];

                // Get the current year
                var currentYear = new Date().getFullYear();

                // Process Store daily sales data for the current year
                for (var i = 0; i < storeDates.length; i++) {
                    if (storeDates[i]) {
                        var date = new Date(storeDates[i]);
                        if (date.getFullYear() === currentYear) {  // Filter for the current year
                            var formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                            chartCategories.push(formattedDate);
                            storeChartData.push(storeSums[i]);
                        }
                    }
                }

                // Process Shopee daily sales data for the current year
                for (var i = 0; i < shopeeDates.length; i++) {
                    if (shopeeDates[i]) {
                        var date = new Date(shopeeDates[i]);
                        if (date.getFullYear() === currentYear) {  // Filter for the current year
                            var formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                            if (!chartCategories.includes(formattedDate)) {
                                chartCategories.push(formattedDate);
                            }
                            shopeeChartData.push(shopeeSums[i]);
                        }
                    }
                }

                // Store and Shopee Daily Sales Chart Configuration
                function renderChart() {
                    var dailySalesOptions = {
                        series: [{
                            name: 'Store Daily Sales',
                            data: storeChartData // Store daily sales data
                        }, {
                            name: 'Shopee Daily Sales',
                            data: shopeeChartData // Shopee daily sales data
                        }],
                        chart: {
                            height: 300,
                            type: 'bar', // Stacked bar chart
                            stacked: true // Enable stacking
                        },
                        colors: ['#21eb1a', '#f98c14'], // Store and Shopee colors
                        dataLabels: {
                            enabled: false
                        },
                        xaxis: {
                            type: 'datetime',
                            categories: chartCategories // Formatted dates
                        },
                        tooltip: {
                            y: {
                                formatter: function(val) {
                                    return val + " USD"; // Customize tooltip value display
                                }
                            }
                        },
                        plotOptions: {
                            bar: {
                                horizontal: false, // Vertical bars
                                columnWidth: '50%' // Adjust column width
                            }
                        },
                        fill: {
                            opacity: 1
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'center'
                        }
                    };

                    if (dailySalesChart) {
                        dailySalesChart.destroy(); // Destroy the previous chart instance
                    }
                    dailySalesChart = new ApexCharts(document.querySelector("#dailySalesChart"), dailySalesOptions);
                    dailySalesChart.render();
                }

                // Initialize Daily Sales Chart as a stacked bar chart
                renderChart();
            },
            error: function(xhr, status, error) {
                console.error("Error fetching daily sales data:", error);
            }
        });
    }


    let monthlySalesChart; // Declare the chart variable outside of the function
    
    function fetchMonthlySalesData() {
        $.ajax({
            url: '/fetchSalesDashboards', // Change this to your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Extracting the store and Shopee monthly sales data
                const monthlyStoreSales = response[1]?.store_monthly_sales || {};
                const storeMonths = monthlyStoreSales.month || [];
                const storeSums = monthlyStoreSales.sum || [];
    
                const monthlyShopeeSales = response[4]?.shopee_monthly_sales || {};
                const shopeeMonths = monthlyShopeeSales.month || [];
                const shopeeSums = monthlyShopeeSales.sum || [];
    
                // Prepare categories for 2024 and initialize data arrays
                const chartCategories = [];
                const storeChartData = Array(12).fill(0);  // 12 months initialized to 0
                const shopeeChartData = Array(12).fill(0); // 12 months initialized to 0
    
                // Set categories for each month of 2024
                for (let month = 0; month < 12; month++) {
                    const date = new Date(2024, month);
                    const monthName = date.toLocaleString('en-US', { month: 'long' });
                    chartCategories.push(monthName);
                }
    
                // Process Store monthly sales data for 2024
                storeMonths.forEach((month, index) => {
                    if (month) {
                        const date = new Date(month + '-01');
                        if (date.getFullYear() === 2024) {
                            const monthIndex = date.getMonth();
                            storeChartData[monthIndex] += storeSums[index] || 0;  // Ensure safe addition
                        }
                    }
                });
    
                // Process Shopee monthly sales data for 2024
                shopeeMonths.forEach((month, index) => {
                    if (month) {
                        const date = new Date(month + '-01');
                        if (date.getFullYear() === 2024) {
                            const monthIndex = date.getMonth();
                            shopeeChartData[monthIndex] += shopeeSums[index] || 0;  // Ensure safe addition
                        }
                    }
                });
    
                // Function to initialize or update the chart
                function renderChart(chartType) {
                    const monthlySalesOptions = {
                        series: [
                            {
                                name: 'Store Monthly Sales',
                                data: storeChartData
                            },
                            {
                                name: 'Shopee Monthly Sales',
                                data: shopeeChartData
                            }
                        ],
                        chart: {
                            height: 300,
                            type: chartType // Set the chart type dynamically
                        },
                        colors: ['#21eb1a', '#f98c14'],
                        dataLabels: {
                            enabled: false
                        },
                        xaxis: {
                            categories: chartCategories
                        },
                        tooltip: {
                            x: {
                                format: 'MMMM'
                            }
                        }
                    };
    
                    // Destroy the existing chart if it exists
                    if (typeof monthlySalesChart !== 'undefined') {
                        monthlySalesChart.destroy();
                    }
    
                    // Initialize Monthly Sales Chart
                    monthlySalesChart = new ApexCharts(document.querySelector("#monthlySalesChart"), monthlySalesOptions);
                    monthlySalesChart.render();
                }
    
                // Render the initial chart as area
                renderChart('area');
    
                // Event listener for chart type change
                $('#chartTypeSelectMonthly').on('change', function() {
                    const selectedType = $(this).val(); // Get selected chart type
                    renderChart(selectedType); // Render the chart with the selected type
                });
    
            },
            error: function(xhr, status, error) {
                console.error('Error fetching monthly sales data:', error);
                alert('Failed to fetch monthly sales data. Please try again later.');
            }
        });
    }

    // Event listener for chart type selection
    document.getElementById('chartTypeSelectMonthly').addEventListener('change', function() {
        const selectedChartType = this.value; // Get the selected value from the dropdown
        if (monthlySalesChart) {
            monthlySalesChart.updateOptions({
                chart: {
                    type: selectedChartType // Update the chart type
                }
            });
        }
    });

    let storeYearlySalesChart; // Store chart variable
    let shopeeYearlySalesChart; // Shopee chart variable
    
    function fetchyearlySalesData() {
        $.ajax({
            url: '/fetchSalesDashboards', // Change this to your actual endpoint
            method: 'GET',
            dataType: 'json',
            success: function(response) {
                // Extracting the Store and Shopee yearly sales data
                const yearlyStoreSales = response[2]?.store_yearly_sales || {};
                const storeYears = yearlyStoreSales.year || [];
                const storeSums = yearlyStoreSales.sum || [];
    
                const yearlyShopeeSales = response[5]?.shopee_yearly_sales || {};
                const shopeeYears = yearlyShopeeSales.year || [];
                const shopeeSums = yearlyShopeeSales.sum || [];
    
                // Process yearly sales data for both Store and Shopee
                const storeChartData = [];
                const storeLabels = [];
                storeYears.forEach((year, index) => {
                    if (year) {
                        storeLabels.push(year);
                        storeChartData.push(storeSums[index] || 0);
                    }
                });
    
                const shopeeChartData = [];
                const shopeeLabels = [];
                shopeeYears.forEach((year, index) => {
                    if (year) {
                        shopeeLabels.push(year);
                        shopeeChartData.push(shopeeSums[index] || 0);
                    }
                });
    
                // Function to render a donut chart for Store yearly sales
                function renderStoreChart() {
                    const storeSalesOptions = {
                        series: storeChartData,
                        chart: {
                            height: 300,
                            type: 'donut'
                        },
                        labels: storeLabels,
                        colors: ['#21eb1a', '#28a745'],
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            text: "Store Yearly Sales",
                            align: 'center'
                        }
                    };
    
                    // Destroy the existing chart if it exists
                    if (storeYearlySalesChart) {
                        storeYearlySalesChart.destroy();
                    }
    
                    // Initialize the store chart
                    storeYearlySalesChart = new ApexCharts(document.querySelector("#storeSalesChartYear"), storeSalesOptions);
                    storeYearlySalesChart.render();
                }
    
                // Function to render a donut chart for Shopee yearly sales
                function renderShopeeChart() {
                    const shopeeSalesOptions = {
                        series: shopeeChartData,
                        chart: {
                            height: 300,
                            type: 'donut'
                        },
                        labels: shopeeLabels,
                        colors: ['#f98c14', '#ffc107'],
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            text: "Shopee Yearly Sales",
                            align: 'center'
                        }
                    };
    
                    // Destroy the existing chart if it exists
                    if (shopeeYearlySalesChart) {
                        shopeeYearlySalesChart.destroy();
                    }
    
                    // Initialize the Shopee chart
                    shopeeYearlySalesChart = new ApexCharts(document.querySelector("#shopeeSalesChartYear"), shopeeSalesOptions);
                    shopeeYearlySalesChart.render();
                }
    
                // Render both charts
                renderStoreChart();
                renderShopeeChart();
            },
            error: function(xhr, status, error) {
                console.error('Error fetching yearly sales data:', error);
                alert('Failed to fetch yearly sales data. Please try again later.');
            }
        });
    }
    
    // Call the function to fetch data and render the charts
    fetchyearlySalesData();
    

    // Call the functions to fetch data and render the charts
    fetchDailySalesData();
    fetchMonthlySalesData();
});
