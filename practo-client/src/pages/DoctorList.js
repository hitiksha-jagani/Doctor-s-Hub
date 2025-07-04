import React, { useEffect, useState } from "react";
import { fetchAllDoctors } from "../services/doctorService";
import DoctorCard from "../components/DoctorCard";
import "../styles/DoctorList.css";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchAllDoctors()
      .then((res) => {
        if (Array.isArray(res)) {
          setDoctors(res);
        } else if (res && Array.isArray(res.doctors)) {
          setDoctors(res.doctors);
        } else {
          console.error("Unexpected response format:", res);
          setDoctors([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      });
  }, []);

  

  return (
    <div className="doctor-list-container">
      {doctors.length === 0 ? (
        <p>No doctors available.</p>
      ) : (
        <div className="doctor-grid">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorList;
