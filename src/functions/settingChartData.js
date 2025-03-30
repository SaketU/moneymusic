import { gettingDate } from "./getDate";

export const settingChartData = (setChartData, data1, data2) => {
  if (data2) {
    setChartData({
      labels: data1?.map((data) => data[0]),
      datasets: [
        {
          label: "Artist 1",
          data: data1?.map((data) => data[1]),
          borderWidth: 1,
          fill: false,
          backgroundColor: "rgba(58, 128, 233,0.1)",
          tension: 0.25,
          borderColor: "#3a80e9",
          pointRadius: 0,
          yAxisID: "artist1",
        },
        {
          label: "Artist 2",
          data: data2?.map((data) => data[1]),
          borderWidth: 1,
          fill: false,
          tension: 0.25,
          borderColor: "#61c96f",
          pointRadius: 0,
          yAxisID: "artist2",
        },
      ],
    });
  } else {
    setChartData({
      labels: data1?.map((data) => data[0]),
      datasets: [
        {
          data: data1?.map((data) => data[1]),
          borderWidth: 1,
          fill: true,
          backgroundColor: "rgba(58, 128, 233,0.1)",
          tension: 0.25,
          borderColor: "#3a80e9",
          pointRadius: 0,
          yAxisID: "artist1",
        },
      ],
    });
  }
};