import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/GenerateReport.css';

function GenerateReport() {
  const [showUserChart, setShowUserChart] = useState(false); // For User chart toggle
  const [showAppointmentChart, setShowAppointmentChart] = useState(false); // For Appointment chart toggle
  const navigate = useNavigate();

  // URLs with query parameters
  const chartUrl = "http://localhost:8080/admin/generate-report?type=user"; // User report
  const appointmentChartUrl = "http://localhost:8080/admin/generate-report?type=appointment"; // Appointment report

  const handleShowUserChart = () => {
    setShowUserChart(true); // Show the user chart when clicked
  };

  const handleShowAppointmentChart = () => {
    setShowAppointmentChart(true); // Show the appointment chart when clicked
  };

  const handleDownloadUserReport = () => {
    fetch(chartUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create a URL for the blob
        link.download = "user-report.png"; // Set the file name for user chart
        link.click(); // Trigger the download
      })
      .catch(error => console.error("Download failed:", error));
  };

  const handleDownloadAppointmentReport = () => {
    fetch(appointmentChartUrl)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create a URL for the blob
        link.download = "appointment-report.png"; // Set the file name for appointment chart
        link.click(); // Trigger the download
      })
      .catch(error => console.error("Download failed:", error));
  };

  return (
    <div className="generate-report-container">
      <h2 className="title">Generate Reports</h2>

      <div className="button-container">
        {/* User Report Button */}
        <button onClick={handleShowUserChart} className="report-btn">
          Users Per Day
        </button>
        {/* Appointment Report Button */}
        <button onClick={handleShowAppointmentChart} className="report-btn">
          Appointment Report
        </button>
      </div>

      {/* Display User Chart if clicked */}
      {showUserChart && (
        <div className="chart-container">
          <img
            src={chartUrl}
            alt="User Report Chart"
            className="report-chart"
          />
          <div className="download-btn-container">
            <button onClick={handleDownloadUserReport} className="download-btn">
              Download User Report
            </button>
          </div>
        </div>
      )}

      {/* Display Appointment Chart if clicked */}
      {showAppointmentChart && (
        <div className="chart-container">
          <img
            src={appointmentChartUrl}
            alt="Appointment Report Chart"
            className="report-chart"
          />
          <div className="download-btn-container">
            <button onClick={handleDownloadAppointmentReport} className="download-btn">
              Download Appointment Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateReport;
