package com.example.demo.DTO;

public class AppointmentRequestDTO {
    private Long patientId;
    private Long doctorId;
    private String date;
    private String timeSlot;
    private String razorpayPaymentId;
    // private String razorpayOrderId;
    private int amount;

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public Long getPatientId() {
        return patientId;
    }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    // public String getRazorpayOrderId() {
    //     return razorpayOrderId;
    // }

    // public void setRazorpayOrderId(String razorpayOrderId) {
    //     this.razorpayOrderId = razorpayOrderId;
    // }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }

    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }
}
