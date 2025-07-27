package com.example.demo.Controller;

import com.example.demo.Model.Appointment;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.AppointmentService;
import com.example.demo.Service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.DTO.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.*;

@RestController
@RequestMapping("")
public class RegistrationController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AppointmentService appointmentService; 

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationDTO dto) {
        try {
            userService.registerUser(dto);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest, HttpSession session) {
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

            // Save user in session if needed
            session.setAttribute("user", user);

            // Return full user data to frontend
            UserResponseDTO userResponseDTO = new UserResponseDTO(user);
            return ResponseEntity.ok(userResponseDTO);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                Map.of("message", e.getMessage())
            );
        }
    }

    // ✅ Get user details by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(new UserResponseDTO(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Delete user by ID (Sign Out)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
            .map(user -> {
                user.setFirstName(updatedUser.getFirstName());
                user.setLastName(updatedUser.getLastName());
                user.setPhone(updatedUser.getPhone());
                user.setGender(updatedUser.getGender());
                userRepository.save(user);
                return ResponseEntity.ok("User updated successfully");
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                            @RequestBody Map<String, String> passwordMap,
                                            HttpServletRequest request) {
        String oldPassword = passwordMap.get("oldPassword");
        String newPassword = passwordMap.get("newPassword");

        try {
            userService.changePassword(id, oldPassword, newPassword);

            // ✅ Invalidate session (log user out)
            request.getSession().invalidate();

            // ✅ Inform frontend to redirect to login
            return ResponseEntity.ok("Password changed successfully. Please log in again.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/users/{userId}/appointments")
    public ResponseEntity<List<AppointmentResponseDTO>> getAppointmentsForUser(@PathVariable Long userId) {
        List<AppointmentResponseDTO> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    // AppointmentController.java
    @PutMapping("/users/{appointmentId}/cancel")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok("Appointment cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to cancel appointment");
        }
    }

    @GetMapping("/reschedule/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Long id) {
        //Appointment appointment = appointmentService.findById(id); // ✅ This is fine
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

}
