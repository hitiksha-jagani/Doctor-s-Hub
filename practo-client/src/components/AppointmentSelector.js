import React from "react";

const AppointmentSelector = ({
  availableDays,
  selectedDay,
  setSelectedDay,
  selectedTimeSlot,
  setSelectedTimeSlot,
  getTimeSlotsForDay
}) => {
  return (
    <div>
      <h3>Select an Appointment Day</h3>
      {availableDays.map((dayObj, index) => (
        <button
          key={index}
          style={{
            margin: "5px",
            padding: "10px",
            backgroundColor: selectedDay?.date === dayObj.date ? "#4caf50" : "#eee"
          }}
          onClick={() => {
            setSelectedDay(dayObj);
            setSelectedTimeSlot(null); // reset time slot when day changes
          }}
        >
          {dayObj.display}
        </button>
      ))}

      {selectedDay && (
        <>
          <h4>Available Time Slots on {selectedDay.day}</h4>
          {getTimeSlotsForDay(selectedDay.day).map((slot, index) => (
            <div key={index}>
              <label>
                <input
                  type="radio"
                  name="timeSlot"
                  value={slot}
                  checked={selectedTimeSlot === slot}
                  onChange={() => setSelectedTimeSlot(slot)}
                />
                {slot}
              </label>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AppointmentSelector;
