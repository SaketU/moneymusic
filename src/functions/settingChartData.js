export const settingChartData = (setChartData, stock_prices) => {
  // Define the fixed month labels from Jan 2022 to Mar 2025.
  const monthLabels = [
    "Jan-2022", "Feb-2022", "Mar-2022", "Apr-2022", "May-2022", "Jun-2022",
    "Jul-2022", "Aug-2022", "Sep-2022", "Oct-2022", "Nov-2022", "Dec-2022",
    "Jan-2023", "Feb-2023", "Mar-2023", "Apr-2023", "May-2023", "Jun-2023",
    "Jul-2023", "Aug-2023", "Sep-2023", "Oct-2023", "Nov-2023", "Dec-2023",
    "Jan-2024", "Feb-2024", "Mar-2024", "Apr-2024", "May-2024", "Jun-2024",
    "Jul-2024", "Aug-2024", "Sep-2024", "Oct-2024", "Nov-2024", "Dec-2024",
    "Jan-2025", "Feb-2025", "Mar-2025"
  ];

  // Map each month to its corresponding stock price, defaulting to 0 if not available.
  const dataPoints = monthLabels.map(label => {
    // You can change the default value (0) to null if you'd prefer missing points to be skipped.
    for (let i = 0; i < stock_prices.length; i++) {
      if (stock_prices[i][0] === label) {
        return stock_prices[i][1];
      }
    }
  });

  setChartData({
    labels: monthLabels,
    datasets: [
      {
        label: "Stock Price",
        data: dataPoints,
        borderWidth: 2,
        fill: false,
        backgroundColor: "rgba(58, 128, 233, 0.1)",
        borderColor: "#3a80e9",
        tension: 0.25,
        pointRadius: 3,
      },
    ],
  });
};
