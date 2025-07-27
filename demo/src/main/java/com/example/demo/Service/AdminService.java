package com.example.demo.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.DTO.AppointmentResponseDTO;
import com.example.demo.DTO.UserRegistrationDTO;
import com.example.demo.Model.Appointment;
import com.example.demo.Model.Doctor;
import com.example.demo.Model.Role;
import com.example.demo.Model.User;
import com.example.demo.Repository.AppointmentRepository;
import com.example.demo.Repository.DoctorRepository;
import com.example.demo.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.validation.Valid;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    public void registerAdmin(@Valid UserRegistrationDTO dto) throws Exception {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new Exception("Passwords do not match");
        }

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }

        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        user.setGender(dto.getGender());
        user.setRole(Role.ROLE_ADMIN); 
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        userRepository.save(user);
    }

    public User authenticate(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new Exception("Invalid email or password");
        }

        return user;
    }

    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        return userRepository.findById(id)
            .map(user -> {
                if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
                    throw new IllegalArgumentException("Current password is incorrect");
                }
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return true;
            })
            .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    public List<User> getAllAdmins() {
        return userRepository.findByRole(Role.ROLE_ADMIN);
    }

    // public List<Doctor> getAllDoctors(){
    //     return doctorRepository.findAll();
    // }

    public User updateAdmin(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

        existing.setFirstName(updatedUser.getFirstName());
        existing.setLastName(updatedUser.getLastName());
        existing.setPhone(updatedUser.getPhone());
        existing.setGender(updatedUser.getGender());

        return userRepository.save(existing);
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        Doctor existing = doctorRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

            existing.setFirstName(updatedDoctor.getFirstName());
            existing.setLastName(updatedDoctor.getLastName());
            existing.setPhone(updatedDoctor.getPhone());
            existing.setExperience(updatedDoctor.getExperience());
            existing.setSpecialization(updatedDoctor.getSpecialization());
            existing.setFees(updatedDoctor.getFees());

        return doctorRepository.save(existing);
    }

    public void deleteAdmin(Long id) {
        userRepository.deleteById(id);
    }

    public void deleteDoctor(Long id){
        doctorRepository.deleteById(id);
    }

    public List<User> getAllUsersWithRoleUser() {
        return userRepository.findByRole(Role.ROLE_USER);
    }

    public void deleteUserById(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<AppointmentResponseDTO> getAllAppointmentsForAdmin() {
        return appointmentRepository.findAll()
            .stream()
            .map((Appointment appt) -> {  // Explicitly declare the Appointment type
                AppointmentResponseDTO dto = new AppointmentResponseDTO();
                dto.setId(appt.getId());
                dto.setPatientName(appt.getPatient().getFirstName() + " " + appt.getPatient().getLastName());
                dto.setDoctorName(appt.getDoctor().getFirstName() + " " + appt.getDoctor().getLastName());
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                dto.setDate(appt.getDate().format(formatter)); // Example: "14-04-2025"
                dto.setTimeSlot(appt.getTimeSlot());
                // dto.setRazorpayOrderId(appt.getRazorpayOrderId());
                dto.setRazorpayPaymentId(appt.getRazorpayPaymentId());
                return dto;
            })
            .collect(Collectors.toList());
    }

    public List<Object[]> getUserCountPerDay() {
        return userRepository.countUsersByDate();
    }
    
    public List<Object[]> getAppointmentCountPerDay() {
        // SQL query to count appointments per day
        String query = "SELECT a.date, COUNT(a) FROM Appointment a GROUP BY a.date ORDER BY a.date";

        // Execute the query and return the result list
        return entityManager.createQuery(query, Object[].class).getResultList();
    }
    
}
