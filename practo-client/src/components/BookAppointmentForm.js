import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDoctorById } from "../services/doctorService";

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
      date: date.toISOString().split("T")[0],
      day: dayName,
      display: formattedDate,
    });
  }
  return days;
};

const BookAppointmentForm = () => {
  const { id } = useParams(); // doctor ID
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availableDays, setAvailableDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchDoctor = async () => {
      const doctorData = await fetchDoctorById(id);
      setDoctor(doctorData);

      const upcomingDays = getNext7Days();
      const filtered = upcomingDays.filter(day =>
        doctorData.availability.some(
          avail => avail.day.toLowerCase() === day.day.toLowerCase()
        )
      );
      setAvailableDays(filtered);
    };

    fetchDoctor();
  }, [id]);

  const getTimeSlotsForDay = (dayName) => {
    const matched = doctor?.availability.find(
      (a) => a.day.toLowerCase() === dayName.toLowerCase()
    );
    return matched ? matched.timeSlots : [];
  };

  const handlePayment = async () => {
    
    if (!selectedDay || !selectedTimeSlot) {
      alert("Please select a day and time slot first.");
      return;
    }

    const totalAmount = (doctor.fees * 1.18); // GST included

      const response = await fetch(`http://localhost:8080/doctors/${doctor.id}/appointments/create-order?amount=${encodeURIComponent(totalAmount)}`, {
        method: "POST"
      });
      const data = await response.json();
      let paymentHandled = false;
      const options = {
        key: "rzp_test_fy6zqNXKLr0uLd",
        // amount: totalAmount * 100,
        amount: data.amount,
        name: "Doctor's Hub",
        description: `Appointment with Dr. ${doctor.firstName}`,
        order_id: data.id,
        handler: async function (response) {
          if (paymentHandled) return; // <-- STOP SECOND TIME
        paymentHandled = true;  

          console.log("Navigating with state:", {
            patientId: user.id,
            doctorId: doctor.id,
            selectedDate: selectedDay.date,
            selectedTimeSlot: selectedTimeSlot,
            amount: totalAmount,
            paymentId: response.razorpay_payment_id,
            orderId: data.id
          });
          
          // ✅ Redirect to success page with booking data
          navigate("/payment-success", {
            state: {
              patientId: user.id,
              doctorId: doctor.id,
              selectedDate: selectedDay.date,      
              selectedTimeSlot: selectedTimeSlot,  
              amount: totalAmount,                 
              paymentId: response.razorpay_payment_id
            }
          });
        },
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#3399cc"
        }
      };

      const rzp = new window.Razorpay(options);
      setIsSubmitting(true);
      rzp.open();
    };

  const handleTimeSlotSelect = async (slot) => {
    const isBooked = await checkSlotBooked(slot);
    if (isBooked) {
      alert("This time slot is already booked. Please select another one.");
      return;
    }
  
    setSelectedTimeSlot(slot); // ✅ Only set if not booked
  };
  
  const checkSlotBooked = async (slot) => {
    try {
      const formattedDate = selectedDay.date;
      const res = await fetch(`http://localhost:8080/doctors/${doctor.id}/appointments/check-slot?doctorId=${doctor.id}&date=${formattedDate}&timeSlot=${slot}`);
  
      const isBooked = await res.json();  // this is true/false
      return isBooked;
    } catch (err) {
      console.error("Error checking slot:", err);
      return false; // fallback to allow
    }
  };

  return (
    <div className="book-appointment-container">
      <h2 className="book-appointment-title">
        Book Appointment with Dr. {doctor?.firstName} {doctor?.lastName}
      </h2>
  
      <h3 className="section-heading">Select Available Day:</h3>
      <div className="day-grid">
        {availableDays.map((day, index) => (
          <button
            key={index}
            onClick={() => setSelectedDay(day)}
            className={`available-day-btn ${
              selectedDay?.date === day.date ? 'selected' : ''
            }`}
          >
            {day.day} ({day.display})
          </button>
        ))}
      </div>
  
      {selectedDay && (
        <>
          <h3 className="section-heading time-slot-header">
            Available Time Slots for {selectedDay.day}:
          </h3>
          <div className="time-slot-container">
            {getTimeSlotsForDay(selectedDay.day).map((slot, index) => (
              <label
                key={index}
                className={`time-slot-label ${
                  selectedTimeSlot === slot ? 'selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="timeSlot"
                  value={slot}
                  checked={selectedTimeSlot === slot}
                  onChange={() => handleTimeSlotSelect(slot)}
                  className="time-slot-radio"
                />
                {slot}
              </label>
            ))}
          </div>
        </>
      )}
  
      <div className="payment-btn-container">
        <button
          disabled={isSubmitting}
          onClick={handlePayment}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
  
};
export default BookAppointmentForm;
