package com.example.demo.DTO;

import jakarta.validation.constraints.*;

public class ReviewRequestDTO {

    @Min(1)
    @Max(5)
    private int rating;

    @NotBlank(message = "Review is required")
    private String review;

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    // Remove userId from DTO – fetch from Spring Security context

    public ReviewRequestDTO() {}

    public ReviewRequestDTO(int rating, String review, Long doctorId) {
        this.rating = rating;
        this.review = review;
        this.doctorId = doctorId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getReview() {
        return review;
    }

    public void setReview(String review) {
        this.review = review;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }
}
