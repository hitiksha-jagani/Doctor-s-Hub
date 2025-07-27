package com.example.demo.Model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(
  name = "appointment",
  uniqueConstraints = @UniqueConstraint(columnNames = {"doctor_id", "date", "time_slot"})
)

public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Appointment date is required")
    private LocalDate date;

    @NotBlank(message = "Time slot must be selected")
    private String timeSlot;

    private String razorpayPaymentId;
    // private String razorpayOrderId;
    // private String status;

    // @Enumerated(EnumType.STRING)
    // @Column(nullable = false)
    // private BookingStatus bookingStatus = BookingStatus.BOOKED; 

    @NotNull(message = "Amount is required")
    private Double amount; // Store amount in paise (e.g., 50000 for ₹500)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // prevent circular ref
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User patient;

    public Appointment(){};

    public Appointment(Long id, LocalDate date, String timeSlot, String razorpayPaymentId,
      
        Doctor doctor, User patient, Double amount) {
            this.id = id;
            this.date = date;
            this.timeSlot = timeSlot;
            this.razorpayPaymentId = razorpayPaymentId;
            // this.razorpayOrderId = razorpayOrderId;
            // this.status = status;
            // this.bookingStatus = bookingStatus;
            this.doctor = doctor;
            this.patient = patient;
            this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public User getPatient() {
        return patient;
    }

    public void setPatient(User patient) {
        this.patient = patient;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    // public void setRazorpayOrderId(String razorpayOrderId) {
    //     this.razorpayOrderId = razorpayOrderId;
    // }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    // public String getRazorpayOrderId() {
    //     return razorpayOrderId;
    // }

    // public String getStatus() {
    //     return status;
    // }

    // public void setStatus(String status) {
    //     this.status = status;
    // }

    // public BookingStatus getBookingStatus() {
    //     return bookingStatus;
    // }

    // public void setBookingStatus(BookingStatus bookingStatus) {
    //     this.bookingStatus = bookingStatus;
    // }

    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
}

