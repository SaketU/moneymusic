export const settingChartData = (setChartData, dataPairs, days, metricType = "stock_price") => {
  // Determine the number of months to show based on the selected days.
  let monthsToShow;
  if (days === 30) {
    monthsToShow = 2;
  } else if (days === 60) {
    monthsToShow = 3;
  } else if (days === 90) {
    monthsToShow = 4;
  } else if (days === 365) {
    monthsToShow = 12;
  } else if (days === 1825) {
    monthsToShow = dataPairs.length;
  } else {
    // Default: show all data if days is unrecognized.
    monthsToShow = dataPairs.length;
  }

  // Filter the data to show only the most recent months.
  const filteredData = dataPairs.slice(-monthsToShow);
  const labels = filteredData.map(([month]) => month);
  const dataPoints = filteredData.map(([_, value]) => value);

  // Choose dataset label and colors based on metricType.
  const datasetLabel = metricType === "monthly_listeners" ? "Monthly Listeners" : "Stock Price";
  const backgroundColor =
    metricType === "monthly_listeners" ? "rgba(142, 68, 173, 0.1)" : "rgba(58, 128, 233, 0.1)";
  const borderColor =
    metricType === "monthly_listeners" ? "#8e44ad" : "#3a80e9";

  setChartData({
    labels: labels,
    datasets: [
      {
        label: datasetLabel,
        data: dataPoints,
        borderWidth: 2,
        fill: false,
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        tension: 0.25,
        pointRadius: 3,
      },
    ],
  });
};
