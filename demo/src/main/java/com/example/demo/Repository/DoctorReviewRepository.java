package com.example.demo.Repository;

import com.example.demo.Model.DoctorReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorReviewRepository extends JpaRepository<DoctorReview, Long> {
    List<DoctorReview> findByDoctorId(Long doctorId);
}
