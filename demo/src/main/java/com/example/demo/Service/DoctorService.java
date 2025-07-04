package com.example.demo.Service;

import com.example.demo.DTO.AvailabilityDTO;
import com.example.demo.DTO.DoctorRequestDTO;
import com.example.demo.DTO.DoctorResponseDTO;
import com.example.demo.DTO.ReviewResponseDTO;
import com.example.demo.Exception.DoctorAlreadyExistsException;
import com.example.demo.Model.*;
import com.example.demo.Repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorReviewRepository doctorReviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Doctor addDoctor(DoctorRequestDTO dto) {

        if (doctorRepository.existsByEmail(dto.getEmail())) {
            throw new DoctorAlreadyExistsException("Doctor already exists with email: " + dto.getEmail());
        }

        Doctor doctor = new Doctor();
        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setFees(dto.getFees());
        doctor.setExperience(dto.getExperience());

        List<Availability> availabilityList = new ArrayList<>();
        for (AvailabilityDTO availDTO : dto.getAvailability()) {
            Availability availability = new Availability();
            availability.setDay(availDTO.getDay());
            availability.setTimeSlots(availDTO.getTimeSlots());
            availability.setDoctor(doctor);
            availabilityList.add(availability);
        }
        doctor.setAvailability(availabilityList);

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Optional<Doctor> existingDoctor = doctorRepository.findById(id);
        if (existingDoctor.isPresent()) {
            doctor.setId(id); // Set the ID to ensure it's updating the correct doctor
            return doctorRepository.save(doctor);
        }
        return null;
    }

    // Delete a doctor
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<DoctorResponseDTO> getAllDoctorDetails() {
        List<Doctor> doctors = doctorRepository.findAll();

        List<DoctorResponseDTO> responseList = new ArrayList<>();

        for (Doctor doctor : doctors) {
            DoctorResponseDTO dto = new DoctorResponseDTO();
            dto.setId(doctor.getId());
            dto.setFirstName(doctor.getFirstName());
            dto.setLastName(doctor.getLastName());
            dto.setEmail(doctor.getEmail());
            dto.setPhone(doctor.getPhone());
            dto.setSpecialization(doctor.getSpecialization());
            dto.setFees(doctor.getFees());
            dto.setExperience(doctor.getExperience());

            // Availability
            List<AvailabilityDTO> availList = new ArrayList<>();
            for (Availability avail : doctor.getAvailability()) {
                AvailabilityDTO a = new AvailabilityDTO();
                a.setDay(avail.getDay());
                a.setTimeSlots(avail.getTimeSlots());
                availList.add(a);
            }
            dto.setAvailability(availList);

            // Reviews
            List<DoctorReview> reviews = doctorReviewRepository.findByDoctorId(doctor.getId());
            List<ReviewResponseDTO> reviewDTOs = new ArrayList<>();
            double total = 0;
            for (DoctorReview review : reviews) {
                ReviewResponseDTO r = new ReviewResponseDTO();
                r.setRating(review.getRating());
                r.setReview(review.getReview());
                r.setCreatedAt(review.getCreatedAt());
                //r.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
                reviewDTOs.add(r);
                total += review.getRating();
            }

            dto.setReviews(reviewDTOs);
            dto.setAverageRating(reviews.isEmpty() ? 0 : total / reviews.size());

            responseList.add(dto);
        }

        return responseList;
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id).orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public DoctorResponseDTO getDoctorDetailsById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
    
        return mapDoctorToResponseDTO(doctor);
    }    

    public DoctorReview addReview(Long doctorId, Long userId, int rating, String comment) {
        Doctor doctor = getDoctorById(doctorId);
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (rating < 1 || rating > 5) throw new IllegalArgumentException("Rating must be between 1 and 5");

        DoctorReview review = new DoctorReview();
        review.setDoctor(doctor);
        review.setUser(user);
        review.setRating(rating);
        review.setReview(comment);
        //review.setCreatedAt(LocalDateTime.now());

        return doctorReviewRepository.save(review);
    }

    public List<DoctorReview> getDoctorReviews(Long doctorId) {
        return doctorReviewRepository.findByDoctorId(doctorId);
    }

    private DoctorResponseDTO mapDoctorToResponseDTO(Doctor doctor) {
        DoctorResponseDTO dto = new DoctorResponseDTO();
        dto.setId(doctor.getId());
        dto.setFirstName(doctor.getFirstName());
        dto.setLastName(doctor.getLastName());
        dto.setEmail(doctor.getEmail());
        dto.setPhone(doctor.getPhone());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setFees(doctor.getFees());
        dto.setExperience(doctor.getExperience());
    
        // Availability
        List<AvailabilityDTO> availList = new ArrayList<>();
        if (doctor.getAvailability() != null) {
            for (Availability avail : doctor.getAvailability()) {
                AvailabilityDTO a = new AvailabilityDTO();
                a.setDay(avail.getDay());
                a.setTimeSlots(avail.getTimeSlots());
                availList.add(a);
            }
        }
        dto.setAvailability(availList);
    
        // Reviews
        List<DoctorReview> reviews = doctorReviewRepository.findByDoctorId(doctor.getId());
        List<ReviewResponseDTO> reviewDTOs = new ArrayList<>();
        double total = 0;
    
        for (DoctorReview review : reviews) {
            ReviewResponseDTO r = new ReviewResponseDTO();
            r.setRating(review.getRating());
            r.setReview(review.getReview());
            r.setCreatedAt(review.getCreatedAt());
            // Uncomment if username is needed:
            // r.setUserName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
            reviewDTOs.add(r);
            total += review.getRating();
        }
    
        dto.setReviews(reviewDTOs);
        dto.setAverageRating(reviews.isEmpty() ? 0 : total / reviews.size());
    
        return dto;
    }    
}
