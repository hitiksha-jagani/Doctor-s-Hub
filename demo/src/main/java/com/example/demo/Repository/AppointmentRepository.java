package com.example.demo.Repository;

import com.example.demo.Model.Appointment;
import com.example.demo.Model.Doctor;
// import com.example.demo.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.*;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorAndDate(Doctor doctor, LocalDate date);
    List<Appointment> findByPatientId(Long patientId);

    // @Query("SELECT a.timeSlot FROM Appointment a WHERE a.doctor.id = :doctorId AND a.date = :date")
    // List<String> findBookedSlotsForDay(@Param("doctorId") Long doctorId, @Param("date") LocalDate date);
    Optional<Appointment> findByDoctorIdAndDateAndTimeSlot(Long doctorId, LocalDate date, String timeSlot);
    boolean existsByRazorpayPaymentId(String razorpayPaymentId);
    // Optional<Appointment> findByRazorpayOrderId(String razorpayOrderId);
}
