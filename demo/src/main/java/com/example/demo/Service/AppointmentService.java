package com.example.demo.Service;

import com.example.demo.DTO.*;
import com.example.demo.Model.Appointment;
import com.example.demo.Model.BookingStatus;
import com.example.demo.Model.Doctor;
import com.example.demo.Model.User;
import com.example.demo.Repository.AppointmentRepository;
import com.example.demo.Repository.DoctorRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.Exception.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.stream.Collectors;

import java.util.*;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepo;

    @Autowired
    private DoctorRepository doctorRepo;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepo;

    // public Appointment bookAppointment(AppointmentRequestDTO dto) throws Exception {
    //     if (dto.getDoctorId() == null || dto.getPatientId() == null ||
    //         dto.getDate() == null || dto.getTimeSlot() == null || dto.getTimeSlot().isBlank()) {
    //         throw new IllegalArgumentException("All fields are required (doctorId, patientId, date, timeSlot)");
    //     }
    
    //     Optional<Doctor> doctorOpt = doctorRepo.findById(dto.getDoctorId());
    //     Optional<User> patientOpt = userRepo.findById(dto.getPatientId());
    
    //     if (doctorOpt.isEmpty() || patientOpt.isEmpty()) {
    //         throw new Exception("Doctor or Patient not found.");
    //     }
    
    //     Doctor doctor = doctorOpt.get();
    //     User patient = patientOpt.get();
    
    //     LocalDate appointmentDate;
    //     try {
    //         appointmentDate = LocalDate.parse(dto.getDate());
    //     } catch (DateTimeParseException e) {
    //         throw new Exception("Invalid date format. Please use yyyy-MM-dd");
    //     }
    
    //     boolean slotTaken = appointmentRepo
    //             .findByDoctorAndDate(doctor, appointmentDate)
    //             .stream()
    //             .anyMatch(a -> a.getTimeSlot().equals(dto.getTimeSlot()));
    
    //     if (slotTaken) {
    //         throw new Exception("Selected time slot is already booked.");
    //     }
    
    //     Appointment appointment = new Appointment();
    //     appointment.setDate(appointmentDate);
    //     appointment.setTimeSlot(dto.getTimeSlot());
    //     appointment.setDoctor(doctor);
    //     appointment.setPatient(patient);
    //     // appointment.setStatus("PAID");
    //     // appointment.setBookingStatus(BookingStatus.BOOKED);
    //     //appointment.setAmount(response.get("amount")); // if coming from payment success response
    
    //     // 🔥 Payment Info
    //     appointment.setRazorpayPaymentId(dto.getRazorpayPaymentId());
    //     // appointment.setRazorpayOrderId(dto.getRazorpayOrderId());
    
    //     return appointmentRepo.save(appointment);
    // }

    @PostMapping("/doctors/{doctorId}/appointments/paid")
public Appointment bookPaidAppointment(@PathVariable Long doctorId, @RequestBody PaidAppointmentDTO dto) throws Exception {
    // Extract values directly from the PaidAppointmentDTO
    String paymentId = dto.getRazorpayPaymentId();
    double amount = dto.getAmount();
    Long patientId = dto.getPatientId();
    String date = dto.getDate();
    String timeSlot = dto.getTimeSlot();

    System.out.println("Received Appointment Request: Doctor ID = " + doctorId + ", Date = " + dto.getDate() + ", Time Slot = " + dto.getTimeSlot());
    
    // Validation: Ensure all required fields are provided
    if (doctorId == null || patientId == null || date == null || timeSlot == null || timeSlot.isBlank()) {
        throw new IllegalArgumentException("All fields are required (doctorId, patientId, date, timeSlot)");
    }
    
    // Fetch Doctor and Patient from database
    Optional<Doctor> doctorOpt = doctorRepo.findById(doctorId);
    Optional<User> patientOpt = userRepo.findById(patientId);

    if (doctorOpt.isEmpty() || patientOpt.isEmpty()) {
        throw new Exception("Doctor or Patient not found.");
    }

    Doctor doctor = doctorOpt.get();
    User patient = patientOpt.get();
    
    // Convert String to LocalDate for the appointment date
    LocalDate appointmentDate;
    try {
        appointmentDate = LocalDate.parse(date); // Convert String to LocalDate
    } catch (DateTimeParseException e) {
        throw new Exception("Invalid date format. Please use yyyy-MM-dd");
    }

    // Check if the selected time slot is already booked
    boolean slotTaken = appointmentRepo
            .findByDoctorAndDate(doctor, appointmentDate)
            .stream()
            .anyMatch(a -> a.getTimeSlot().equals(timeSlot));

    if (slotTaken) {
        throw new Exception("Selected time slot is already booked.");
    }

    // Create new Appointment object and save it to the database
    Appointment appointment = new Appointment();
    appointment.setDate(appointmentDate);
    appointment.setTimeSlot(timeSlot);
    appointment.setDoctor(doctor);
    appointment.setPatient(patient);
    appointment.setRazorpayPaymentId(paymentId);
    appointment.setAmount(amount);

    return appointmentRepo.save(appointment); // Save the appointment and return the saved entity
}

    public boolean checkPaymentExists(String paymentId) {
        return appointmentRepository.existsByRazorpayPaymentId(paymentId);
    }

    
    public List<AppointmentResponseDTO> getAppointmentsByUserId(Long userId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(userId);

        return appointments.stream()
            .map(appointment -> new AppointmentResponseDTO(
                    appointment.getId(),
                    appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName(),
                    appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName(),
                    appointment.getDate().toString(),
                    appointment.getTimeSlot(),
                    appointment.getAmount()
            ))
            .collect(Collectors.toList());
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // appointment.setBookingStatus(BookingStatus.CANCELLED); 
        return appointmentRepository.save(appointment);
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }
    
    public Appointment findById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found with ID " + id));
    }
    
}
