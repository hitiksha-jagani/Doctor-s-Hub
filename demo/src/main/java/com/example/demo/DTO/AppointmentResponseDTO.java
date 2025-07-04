package com.example.demo.DTO;

public class AppointmentResponseDTO {
    private Long id;
    private String doctorName;
    private String patientName;
    private String date;
    private String timeSlot;
    private String status;
    private String bookingStatus;
    private Double amount;
    private String razorpayOrderId;
    private String razorpayPaymentId;

    public AppointmentResponseDTO() {}

    public AppointmentResponseDTO(Long id, String doctorName, String patientName,
        String date, String timeSlot,  Double amount) {
            this.id = id;
            this.doctorName = doctorName;
            this.patientName = patientName;
            this.date = date;
            this.timeSlot = timeSlot;
            // this.status = status;
            // this.bookingStatus = bookingStatus;
            this.amount = amount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public String getPatientName() {
        return patientName;
    }

    public String getDate() {
        return date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public String getStatus() {
        return status;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
}
