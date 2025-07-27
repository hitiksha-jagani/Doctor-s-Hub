import React, { useEffect, useState } from "react";

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/admin/appointment-list", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>All Appointments</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Sr No</th>
            {/* <th>ID</th> */}
            <th>Patient Name</th>
            <th>Doctor Name</th>
            <th>Appointment Date</th>
            <th>Time Slot</th>
            <th>Payment Id</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a, index) => (
            <tr key={a.id}>
              <td>{index + 1}</td>
              {/* <td>{a.id}</td> */}
              <td>{a.patientName}</td>
              <td>{a.doctorName}</td>
              <td>{a.date}</td>
              <td>{a.timeSlot}</td>
              <td>{a.razorpayPaymentId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllAppointments;
