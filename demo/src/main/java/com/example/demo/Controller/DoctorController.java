package com.example.demo.Controller;

import com.example.demo.DTO.AppointmentRequestDTO;
import com.example.demo.DTO.DoctorResponseDTO;
import com.example.demo.DTO.PaidAppointmentDTO;
import com.example.demo.DTO.ReviewRequestDTO;
import com.example.demo.Model.Role;
import com.example.demo.Model.Appointment;
import com.example.demo.Model.Doctor;
import com.example.demo.Model.DoctorReview;
import com.example.demo.Model.User;
import com.example.demo.Repository.AppointmentRepository;
import com.example.demo.Service.AppointmentService;
import com.example.demo.Service.DoctorService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

// import com.example.demo.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService; 
    
    @Autowired
    private AppointmentService appointmentService; 

    @Autowired
    private AppointmentRepository appointmentRepository;

    private static final Logger logger = LoggerFactory.getLogger(DoctorController.class);


    public DoctorController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // ✅ Public: Get all doctors
    @GetMapping("")
    public ResponseEntity<List<DoctorResponseDTO>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctorDetails());
    }

    // ✅ Public: View single doctor profile
    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDTO> getDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorDetailsById(id));
    }

    // ✅ Patient: Add review
    @PostMapping("/review/add")
    public ResponseEntity<?> addReview(@RequestBody @Valid ReviewRequestDTO request,
                                    @AuthenticationPrincipal User loggedInUser) {
        if (loggedInUser == null || loggedInUser.getRole() != Role.ROLE_USER) {
            return ResponseEntity.status(403).body("Access denied: Only patients can add reviews.");
        }

        DoctorReview review = doctorService.addReview(
            request.getDoctorId(),
            loggedInUser.getId(), // securely extracted from logged-in session
            request.getRating(),
            request.getReview()
        );

        return ResponseEntity.ok(review);
    }

    @GetMapping("/{doctorId}/appointments/check-payment")
    public ResponseEntity<Map<String, Boolean>> checkPayment(@RequestParam String paymentId) {
        boolean exists = appointmentService.checkPaymentExists(paymentId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{doctorId}/appointments/paid")
    public ResponseEntity<Appointment> bookPaidAppointment(@PathVariable Long doctorId, @RequestBody PaidAppointmentDTO dto) {
        try {
            Appointment appointment = appointmentService.bookPaidAppointment(doctorId, dto);
            // System.out.println("Received Full DTO JSON: " + new ObjectMapper().writeValueAsString(dto));
            
            // return ResponseEntity.ok(appointment);
            logger.info("Received Full DTO JSON: {}", new ObjectMapper().writeValueAsString(dto));
            return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
        } catch (Exception e) {
            // e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);   // Success response with Appointment object

        }
    }

    // @GetMapping("/check-slot")
    // public ResponseEntity<Boolean> checkIfSlotBooked(
    //         @RequestParam Long doctorId,
    //         @RequestParam String date,
    //         @RequestParam String timeSlot) {

    //     Optional<Appointment> existing = appointmentRepository
    //         .findByDoctorIdAndDateAndTimeSlot(doctorId, LocalDate.parse(date), timeSlot);

    //     return ResponseEntity.ok(existing.isPresent());
    // }

    @GetMapping("/{doctorId}/appointments/check-slot")
    @CrossOrigin(origins = "http://localhost:3000") // Allow React app to call
    public ResponseEntity<Boolean> checkIfSlotBooked(
            @RequestParam Long doctorId,
            @RequestParam String date,
            @RequestParam String timeSlot) {

        Optional<Appointment> existing = appointmentRepository
            .findByDoctorIdAndDateAndTimeSlot(doctorId, LocalDate.parse(date), timeSlot);

        return ResponseEntity.ok(existing.isPresent());
    }


//     @GetMapping("/get-booked-slots")
// public ResponseEntity<List<String>> getBookedSlots(
//         @RequestParam Long doctorId,
//         @RequestParam String date) {

//     LocalDate parsedDate = LocalDate.parse(date);
//     List<String> bookedSlots = appointmentRepository.findBookedSlotsForDay(doctorId, parsedDate);
    
//     return ResponseEntity.ok(bookedSlots);  // Returns list of booked time slots for the day
// }

    @GetMapping("/from-appointment/{appointmentId}")
    public ResponseEntity<Doctor> getDoctorByAppointmentId(@PathVariable Long appointmentId) {
        Appointment appointment = appointmentService.findById(appointmentId);
        if (appointment == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Doctor doctor = appointment.getDoctor(); // assuming there's a getDoctor() in Appointment
        return ResponseEntity.ok(doctor);
    }

}
