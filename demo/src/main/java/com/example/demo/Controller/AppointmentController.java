package com.example.demo.Controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.Model.Appointment;
import com.example.demo.Model.BookingStatus;
import com.example.demo.Service.*;
import com.example.demo.DTO.*;

public class AppointmentController {
    @Autowired
    private AppointmentService appointmentService;

    @PutMapping("/appointments/{appointmentId}")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable Long appointmentId, 
            @RequestBody AppointmentDTO appointmentDTO) {

        // Fetch the existing appointment by ID
        Appointment appointment = appointmentService.findById(appointmentId);

        // If the appointment is not found, return a 404 error
        if (appointment == null) {
            return ResponseEntity.notFound().build();
        }

        // Convert the incoming date (from string to LocalDate)
        LocalDate newDate = LocalDate.parse(appointmentDTO.getDate()); // Use appointmentDTO

        // Update the appointment
        appointment.setDate(newDate);
        appointment.setTimeSlot(appointmentDTO.getTimeSlot());
        // appointment.setBookingStatus(BookingStatus.RESCHEDULE);

        // Save it
        appointmentService.save(appointment);

        return ResponseEntity.ok(appointment);
    }

}
