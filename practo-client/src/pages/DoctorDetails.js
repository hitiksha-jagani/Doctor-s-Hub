import React, { useEffect, useState } from "react";
import { API } from "../api/api";
import "../styles/AdminDetails.css";
import "../styles/DoctorDetails.css";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

const generateTimeSlots = () => {
  const slots = [];
  const start = 9 * 60;
  const end = 22 * 60;
  for (let time = start; time < end; time += 30) {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;
    const displayMin = minutes === 0 ? "00" : minutes;
    const startStr = `${displayHour}:${displayMin} ${ampm}`;

    const nextTime = time + 30;
    const nextHours = Math.floor(nextTime / 60);
    const nextMinutes = nextTime % 60;
    const nextAMPM = nextHours >= 12 ? "PM" : "AM";
    const nextDisplayHour = nextHours % 12 === 0 ? 12 : nextHours % 12;
    const nextDisplayMin = nextMinutes === 0 ? "00" : nextMinutes;
    const endStr = `${nextDisplayHour}:${nextDisplayMin} ${nextAMPM}`;

    slots.push(`${startStr} - ${endStr}`);
  }
  return slots;
};


const DoctorDetails = () => {
  const [doctors, setDoctors] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedDoctor, setEditedDoctor] = useState({});
  const [editedAvailability, setEditedAvailability] = useState([]);
  const [newAvailability, setNewAvailability] = useState({ day: "", timeSlots: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/admin/doctor-list", { withCredentials: true });
      console.log("Fetched doctors data:", res.data);
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };
  
  const handleEdit = (doctor) => {
    setEditId(doctor.id);
    setEditedDoctor({ ...doctor });
    setEditedAvailability(doctor.availability || []);
  };  

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      await API.delete(`/admin/doctor/${id}`, { withCredentials: true });
      fetchDoctors();
    }
  };

  const handleSave = async () => {
    const updatedDoctor = { ...editedDoctor, availability: editedAvailability };
    await API.put(`/admin/doctor/${editId}`, editedDoctor, { withCredentials: true });
    setEditId(null);
    fetchDoctors();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor({ ...editedDoctor, [name]: value });
  };

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...editedAvailability];
    updated[index][field] = value;
    setEditedAvailability(updated);
  };
  
  
  const handleDeleteAvailability = (index) => {
    const updated = [...editedAvailability];
    updated.splice(index, 1);
    setEditedAvailability(updated);
  };
  
  const handleAddAvailability = () => {
    if (newAvailability.day && newAvailability.timeSlots) {
      setEditedAvailability([
        ...editedAvailability,
        {
          day: newAvailability.day.trim(),
          timeSlots: newAvailability.timeSlots.split(",").map((s) => s.trim()),
        },
      ]);
      setNewAvailability({ day: "", timeSlots: "" });
    }
  };
  

  return (
    <div className="admin-list-container">
      <h2>Doctor List</h2>
      <div className="admin-grid">
        {doctors.map((doctor) => (
          <div className="admin-card" key={doctor.id}>
            {editId === doctor.id ? (
              <>
                <input name="firstName" value={editedDoctor.firstName} onChange={handleChange} />
                <input name="lastName" value={editedDoctor.lastName} onChange={handleChange} />
                <input name="email" readOnly disabled value={editedDoctor.email} onChange={handleChange} />
                <input name="phone"  value={editedDoctor.phone} onChange={handleChange} />
                <input name="experience"  value={editedDoctor.experience} onChange={handleChange} />
                <input name="specialization"  value={editedDoctor.specialization} onChange={handleChange} />
                <input name="fees"  value={editedDoctor.fees} onChange={handleChange} />
                <div>
                  <div>
                    <h4>Edit Availability</h4>
                    {editedAvailability.map((a, index) => (
                    <div key={index} className="availability-edit">
                      <p><strong>{a.day}</strong></p>

                      <select multiple value={a.timeSlots} onChange={(e) =>
                        handleAvailabilityChange(
                          index,
                          "timeSlots",
                          Array.from(e.target.selectedOptions, (option) => option.value)
                        )}>
                          {generateTimeSlots().map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                      </select>
                      <button onClick={() => handleDeleteAvailability(index)}>Delete</button>
                    </div>
                    ))}
            <div className="add-availability">
              <h4>Add New Availability</h4>
              <select
                value={newAvailability.day}
                onChange={(e) =>
                  setNewAvailability({ ...newAvailability, day: e.target.value })
                }
              >
                <option value="">Select Day</option>
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <select
                multiple
                value={newAvailability.timeSlots}
                onChange={(e) =>
                  setNewAvailability({
                    ...newAvailability,
                    timeSlots: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {generateTimeSlots().map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <button onClick={handleAddAvailability}>Add</button>
            </div>
          </div>

            <div className="actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
            </div>
          </>
          ) : (
          <>
            <p><strong>First Name:</strong> {doctor.firstName}</p>
            <p><strong>Last Name:</strong>  {doctor.lastName}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Phone:</strong> {doctor.phone}</p>
            <p><strong>Experience:</strong> {doctor.experience}</p>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>Fees:</strong> {doctor.fees}</p>
            {doctor.availability && doctor.availability.length > 0 && (
              <div>
                <p><strong>Available Days:</strong></p>
                <ul>
                  {doctor.availability.map((a, idx) => (
                    <li key={idx}> <strong>{a.day}</strong>: {a.timeSlots.join(", ")} </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="actions" style={{alignContent: "center"}}>
              <button onClick={() => handleDelete(doctor.id)} style={{ width: "100px", backgroundColor: "#c61919", color: "white"}}>Delete</button>
            </div>
          </>
          )}
          </div>
        ))}
       </div>
    </div>
  );
};
export default DoctorDetails;

