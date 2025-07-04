  import React, { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import { fetchDoctorById } from "../services/doctorService";
  import '../styles/BookAppointmentForm.css'; // Importing CSS
  
  const getNext7Days = () => {
    const days = [];
    const today = new Date();
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
  
      days.push({
        date: date.toISOString().split("T")[0], // For backend: "yyyy-MM-dd"
        day: dayName, // For mapping: "Monday", etc.
        display: formattedDate, // For display: "April 14, 2025"
      });
    }
    return days;
  };
  
  
  const RescheduleAppointment = () => {
    const { id } = useParams(); // This is the appointment ID
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [availableDays, setAvailableDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
  
    useEffect(() => {
        const fetchDoctor = async (appointmentId) => {
            try {
              const response = await fetch(`http://localhost:8080/doctors/from-appointment/${appointmentId}`);
              if (!response.ok) {
                throw new Error("Failed to fetch doctor");
              }
              const doctor = await response.json();
              setDoctor(doctor);
            } catch (error) {
              console.error("Failed to fetch doctor with appointment ID", appointmentId, error);
            }
          };
          
      
        fetchDoctor();
      }, [id]);      
  
    const getTimeSlotsForDay = (dayName) => {
      const matched = doctor?.availability.find(
        (a) => a.day.toLowerCase() === dayName.toLowerCase()
      );
      return matched ? matched.timeSlots : [];
    };
  
    const handleReschedule = async () => {
      const appointmentId = user?.appointmentId;
      const data = {
        date: selectedDay.date,
        timeSlot: selectedTimeSlot,
      };
  
      try {
        const response = await fetch(`/appointments/${appointmentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          navigate("/profile");
        } else {
          alert("Failed to reschedule the appointment.");
        }
      } catch (error) {
        console.error("Error rescheduling appointment:", error);
        alert("An error occurred while rescheduling.");
      }
    };  
  
    return (
      <div className="book-appointment-container">
        <h2 className="book-appointment-title">
          Book Appointment with Dr. {doctor?.firstName} {doctor?.lastName}
        </h2>
  
        <h3>Select Available Day:</h3>
        {availableDays.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(day)}
            className={`available-day-btn ${selectedDay?.date === day.date ? "selected" : ""}`}
          >
            {day.day} ({day.display})
          </button>
        ))}
  
        {selectedDay && (
          <>
            <h3 className="time-slot-header">Available Time Slots for {selectedDay.day}:</h3>
            <div className="time-slot-container">
              {getTimeSlotsForDay(selectedDay.day).map((slot, index) => (
                <label
                  key={index}
                  className={`time-slot-label ${selectedTimeSlot === slot ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={selectedTimeSlot === slot}
                    onChange={() => setSelectedTimeSlot(slot)}
                    className="time-slot-radio"
                  />
                  {slot}
                </label>
              ))}
            </div>
          </>
        )}
  
        <div className="payment-btn-container">
                <button onClick={handleReschedule} className="payment-btn">
                Reschedule Appointment
                </button>
        </div>
      </div>
    );
  };
  
  export default RescheduleAppointment;
  