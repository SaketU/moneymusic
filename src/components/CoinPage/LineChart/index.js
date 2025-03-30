import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // Don't remove this

function LineChart({ chartData }) {
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#333",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "#333",
        },
        grid: {
          display: true,
          color: "#ccc",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;
