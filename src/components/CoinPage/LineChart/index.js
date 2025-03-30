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
          font: {
            family: "Inter, sans-serif",
            size: 14,
          },
          color: "#ccc",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#3a80e9",
        titleFont: {
          family: "Inter, sans-serif",
          size: 16,
        },
        bodyFont: {
          family: "Inter, sans-serif",
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
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "#ccc",
          font: {
            family: "Inter, sans-serif",
            size: 12,
          },
        },
        grid: {
          display: true,
          color: "rgba(255,255,255,0.1)",
          borderDash: [5, 5],
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 6,
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
