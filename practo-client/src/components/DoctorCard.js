import { useNavigate } from "react-router-dom";
import "../styles/DoctorProfile.css"; 

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!doctor) return null;

  const handleBookAppointment = () => {
    if (!user) {
      alert("Please log in to book an appointment");
      navigate("/login");
    } else {
      navigate(`/doctors/${doctor.id}/appointment`);
    }
  };

  return (
    <div className="doctor-card">
      <h3 className="doctor-name">
        Dr. {doctor.firstName} {doctor.lastName}
      </h3>

      <div className="doctor-info-grid">
        <div className="label-column">
          <p>Email:</p>
          <p>Phone:</p>
          <p>Specialization:</p>
          <p>Experience:</p>
          <p>Fees:</p>
        </div>
        <div className="value-column">
          <p>{doctor.email}</p>
          <p>{doctor.phone}</p>
          <p>{doctor.specialization}</p>
          <p>{doctor.experience} years</p>
          <p>₹{doctor.fees}</p>
        </div>
      </div>

      <button
          onClick={handleBookAppointment}
          className="book-appointment-btn"
        >
          Book Appointment
      </button>
    </div>
  );
};

export default DoctorCard;
