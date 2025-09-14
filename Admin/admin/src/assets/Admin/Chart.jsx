import React, { useState, useEffect } from "react";
import "./Chart.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MyChart = () => {
  const [chartData, setChartData] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/statistics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch statistics");

      const data = await response.json();
      setChartData(data.monthlyData);
      setOverallStats(data.overallStats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chart-container">
        <div className="loading-state">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (!chartData || !overallStats) {
    return (
      <div className="chart-container">
        <div className="error-state">
          <i className="fa-solid fa-exclamation-triangle"></i>
          <p>Failed to load statistics</p>
        </div>
      </div>
    );
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const lineData = {
    labels: chartData.map((item) => monthNames[item.month - 1]),
    datasets: [
      {
        label: "Total Issues",
        data: chartData.map((item) => item.total),
        borderColor: "rgba(33, 150, 243, 1)",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Resolved Issues",
        data: chartData.map((item) => item.resolved),
        borderColor: "rgba(76, 175, 80, 1)",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Pending Issues",
        data: chartData.map((item) => item.pending),
        borderColor: "rgba(255, 152, 0, 1)",
        backgroundColor: "rgba(255, 152, 0, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ["Total", "Pending", "Resolved", "Acknowledged", "Rejected"],
    datasets: [
      {
        label: "Issue Count",
        data: [
          overallStats.total,
          overallStats.pending,
          overallStats.resolved,
          overallStats.acknowledged,
          overallStats.rejected,
        ],
        backgroundColor: [
          "rgba(33, 150, 243, 0.8)",
          "rgba(255, 152, 0, 0.8)",
          "rgba(76, 175, 80, 0.8)",
          "rgba(156, 39, 176, 0.8)",
          "rgba(244, 67, 54, 0.8)",
        ],
        borderColor: [
          "rgba(33, 150, 243, 1)",
          "rgba(255, 152, 0, 1)",
          "rgba(76, 175, 80, 1)",
          "rgba(156, 39, 176, 1)",
          "rgba(244, 67, 54, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Monthly Issues Trend",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Issues",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Overall Issue Statistics",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Issues",
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fa-solid fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{overallStats.total}</h3>
            <p>Total Issues</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{overallStats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon resolved">
            <i className="fa-solid fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>{overallStats.resolved}</h3>
            <p>Resolved</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rate">
            <i className="fa-solid fa-percentage"></i>
          </div>
          <div className="stat-content">
            <h3>{overallStats.resolutionRate}%</h3>
            <p>Resolution Rate</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-section">
          <Line data={lineData} options={lineOptions} />
        </div>
        <div className="chart-section">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default MyChart;
