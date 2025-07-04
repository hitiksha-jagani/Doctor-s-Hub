package com.example.demo.DTO;

public class RazorpayPaymentResponse {

    // private String razorpayOrderId;
    private String razorpayPaymentId;
    private Double amount;  // Amount in paise

    // Getters and Setters

    // public String getRazorpayOrderId() {
    //     return razorpayOrderId;
    // }

    // public void setRazorpayOrderId(String razorpayOrderId) {
    //     this.razorpayOrderId = razorpayOrderId;
    // }

    public String getRazorpayPaymentId() {
        return razorpayPaymentId;
    }

    public void setRazorpayPaymentId(String razorpayPaymentId) {
        this.razorpayPaymentId = razorpayPaymentId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}

