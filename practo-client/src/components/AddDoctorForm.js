  import React, { useState } from "react";
  import { useNavigate, Outlet } from "react-router-dom";
  import "../styles/AddDoctorForm.css";
  import "../styles/AdminDashboard.css";

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Generate time slots from 9:00 AM to 10:00 PM
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

  const timeSlots = generateTimeSlots();

  const splitTimeSlotsIntoColumns = (slots) => {
    const firstColumn = [];
    const secondColumn = [];

    slots.forEach((slot, index) => {
      if (index % 2 === 0) {
        firstColumn.push(slot);
      } else {
        secondColumn.push(slot);
      }
    });

    return [firstColumn, secondColumn];
  };

  const timeSlotsColumns = splitTimeSlotsIntoColumns(timeSlots);

  const AddDoctorForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      firstName: "", lastName: "", phone: "", email: "", specialization: "",
      fees: "", experience: ""
    });

    const [selectedDay, setSelectedDay] = useState("");
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [availability, setAvailability] = useState([]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleSlot = (slot) => {
      setSelectedSlots((prev) =>
        prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
      );
    };

    const addDayAvailability = () => {
      if (!selectedDay || selectedSlots.length === 0) return alert("Select day and at least one time slot.");
      const alreadyAdded = availability.find((a) => a.day === selectedDay);
      if (alreadyAdded) return alert("This day is already added. Choose another.");

      setAvailability([...availability, { day: selectedDay, timeSlots: [...selectedSlots] }]);
      setSelectedDay("");
      setSelectedSlots([]);
    };

    // Edit availability for a specific day
    const handleEditDay = (index) => {
      const dayData = availability[index];
      setSelectedDay(dayData.day);
      setSelectedSlots(dayData.timeSlots);
      // Remove the current entry so it can be updated
      setAvailability(availability.filter((_, i) => i !== index));
    };

    // Delete availability for a specific day
    const handleDeleteDay = (index) => {
      const updated = [...availability];
      updated.splice(index, 1);
      setAvailability(updated);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const finalData = { ...formData, availability };

      try {
        const response = await fetch("http://localhost:8080/admin/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(finalData),
        });

        if (response.status === 403 || response.redirected) {
          alert("You are not logged in. Redirecting to login page...");
          navigate("/login");
          return;
        }

        const result = await response.json();

        if (response.ok) {
          alert("Doctor added successfully!");

          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            specialization: '',
            fees: '',
            experience: '',
            qualification: '',
            clinicAddress: '',
            rating: ''
          });
    
          setAvailability([]);

          navigate("/admin/add");
        } else {
          alert("Failed: " + result.message);
        }

      } catch (err) {
        console.error("Error adding doctor:", err);
        alert("An error occurred while adding the doctor.");
      }
    };

    return (
      <div className="add-doctor-container">
        <div className="form-content">
          <form onSubmit={handleSubmit} className="add-doctor-form">
            <h2>Add Doctor</h2>

            <input name="firstName" placeholder="First Name" onChange={handleChange} required /><br />
            <input name="lastName" placeholder="Last Name" onChange={handleChange} required /><br />
            <input name="phone" placeholder="Phone" onChange={handleChange} required /><br />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
            <input name="specialization" placeholder="Specialization" onChange={handleChange} required /><br />
            <input name="fees" type="number" placeholder="Fees" onChange={handleChange} required /><br />
            <input name="experience" type="number" placeholder="Experience (years)" onChange={handleChange} required /><br />

            <h4>Select a Day</h4>
            <select value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
              <option value="">-- Select Day --</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day} disabled={availability.some((a) => a.day === day)}>
                  {day}
                </option>
              ))}
            </select>

            {selectedDay && (
              <>
                <h4>Select Time Slots for {selectedDay}</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(() => {
                    const rows = [];
                    for (let i = 0; i < timeSlots.length; i += 2) {
                      rows.push([timeSlots[i], timeSlots[i + 1]]);
                    }
                    return rows;
                  })().map((pair, rowIndex) => (
                    <div
                      key={rowIndex}
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        gap: "5.0rem"
                      }}
                    >
                      {pair.map(
                        (slot) =>
                          slot && (
                            <label
                              key={slot}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "3.0rem",
                                fontSize: "1rem",
                                whiteSpace: "nowrap"
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedSlots.includes(slot)}
                                onChange={() => toggleSlot(slot)}
                              />
                              {slot}
                            </label>
                          )
                      )}
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addDayAvailability}>Add Availability</button>
                <button type="button" onClick={() => { setSelectedDay(""); setSelectedSlots([]); }} style={{ marginLeft: "10px" }}>
                  Clear
                </button>
              </>
            )}

            <h4>Availability Summary</h4>
            <ul>
              {availability.map((a, index) => (
                <li key={a.day}>
                  <strong>{a.day}:</strong> {a.timeSlots.join(", ")}
                  <button type="button" onClick={() => handleEditDay(index)} style={{ marginLeft: "10px", width: "100px" }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteDay(index)} style={{ marginLeft: "-0px", width: "100px", backgroundColor: "#c61919", color: "white"}}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>

            {availability.length > 0 && (
              <button type="button" onClick={() => setAvailability([])} style={{backgroundColor: "#c61919", color: "white"}}>
                Reset All Availability
              </button>
            )}

            <button className="btn" type="submit" >Submit Doctor</button>
          </form>
        </div>
      </div>
    );
  };

  export default AddDoctorForm;
