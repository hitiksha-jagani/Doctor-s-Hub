import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false); 

  const {
    selectedDate,
    selectedTimeSlot,
    doctorId,
    patientId,
    paymentId,
    amount
  } = location.state || {};

  console.log("Amount passed:", amount); 

  useEffect(() => {
    console.log("📦 Navigated state:", location.state);  

    const saveAppointment = async () => {
      if (isSubmitting) return; // prevent double submission
      setIsSubmitting(true);
      
      try {
        const response = await fetch(
          `http://localhost:8080/doctors/${doctorId}/appointments/paid`,
          {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  doctorId, // Directly send doctorId, patientId, etc.
                  patientId,
                  date: selectedDate,
                  timeSlot: selectedTimeSlot,
                  razorpayPaymentId: paymentId,
                  amount: Number(amount),
              }),
          }
      ).then(response => response.json())
      .then(data => {
        if (data.message) {
          //alert(data.message);  // Show alert with the message from the backend
          console.log("✅ Appointment Saved:", data.message);
        } else {
          console.log("✅ Appointment Saved Successfully!"); 
        }
      })
      .catch(error => {
          console.error("Error:", error);
          alert("Failed to book appointment. Please try again.");
      });      

      } catch (error) {
        console.log("Data passed:", { selectedDate, amount, patientId, doctorId, paymentId, selectedTimeSlot });
        console.error("❌ Appointment not saved:", error);
        alert("Something went wrong. Please contact support.");
      } finally {
        setIsSubmitting(false);
    }
    };

    if (doctorId && patientId && selectedDate && selectedTimeSlot && paymentId && amount) {
      saveAppointment();
    }

    const timer = setTimeout(() => {
      navigate("/home");
    }, 5000);
  
    return () => clearTimeout(timer);

  }, [doctorId, patientId, selectedDate, selectedTimeSlot, paymentId, amount]);
// };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h2 style={styles.heading}>Payment Successful!</h2>
        <p style={styles.text}>Your appointment has been successfully booked.</p>
        <p style={styles.redirectNote}>Redirecting to homepage in 5 seconds...</p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // background: "linear-gradient(135deg, #e0f7fa, #e1f5fe)",
    fontFamily: "Segoe UI, sans-serif",
    marginTop : "-100px"
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "400px",
    
  },
  icon: {
    fontSize: "48px",
    color: "#27ae60",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#2c3e50",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "10px",
  },
  redirectNote: {
    fontSize: "14px",
    color: "#888",
    marginTop: "20px",
  },
};

export default PaymentSuccessPage;
