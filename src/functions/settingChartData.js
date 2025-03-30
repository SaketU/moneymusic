export const settingChartData = (setChartData, dataPairs, monthsToShow) => {
  if (!dataPairs || dataPairs.length === 0) {
    setChartData({ labels: [], datasets: [] });
    return;
  }

  // Sort dataPairs by month if needed. Otherwise, assume dataPairs are in chronological order.
  // dataPairs might look like [ ["Jan-2022", 141.74], ["Feb-2022", 145.3], ... ]
  // If you need them sorted, define a compare function here.

  // Slice the last N entries
  const filtered = dataPairs.slice(-monthsToShow);

  // Separate labels and data
  const labels = filtered.map(([month]) => month);
  const dataPoints = filtered.map(([_, value]) => value);

  setChartData({
    labels,
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
