import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart({ chartData }) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#ccc",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#3a80e9",
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 14,
        },
        cornerRadius: 4,
        padding: 10,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ccc",
          autoSkip: false,
          maxRotation: 60,
          minRotation: 30,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "#ccc",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

export default LineChart;
