import React, { useState } from "react";

function GenerateAppointmentReport() {
  const [showChart, setShowChart] = useState(false); // To toggle chart display

  // Updated chart URL for appointment report
  const chartUrl = "http://localhost:8080/admin/generate-report/generate-appointment-report";

  const handleShowChart = () => {
    setShowChart(true); // Show chart on button click
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = chartUrl;
    link.download = "appointment-report.png"; // Set filename for download
    link.click();
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Appointment Reports</h2>

      <button onClick={handleShowChart} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Appointments Per Day
      </button>

      {showChart && (
        <>
          <img
            src={chartUrl}
            alt="Appointment Report Chart"
            style={{ marginTop: "20px", width: "800px", border: "1px solid #ccc" }}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleDownload} style={{ padding: "10px 20px", fontSize: "16px" }}>
              Download Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GenerateAppointmentReport;
