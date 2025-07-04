package com.example.demo.Service;

import com.example.demo.DTO.UserRegistrationDTO;
import com.example.demo.Model.PasswordResetToken;
import com.example.demo.Model.Role;
import com.example.demo.Model.User;
import com.example.demo.Repository.PasswordResetTokenRepository;
import com.example.demo.Repository.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(@Valid UserRegistrationDTO dto) throws Exception {
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
        user.setRole(Role.ROLE_USER);  // default to USER
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

    public void sendPasswordResetEmail(String email) throws MessagingException {
        String cleanedEmail = email.trim().toLowerCase(); // clean the email first
        System.out.println("Received email: [" + email + "]");

        Optional<User> userOptional = userRepository.findByEmail(cleanedEmail);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User with this email does not exist.");
        }
    
        User user = userOptional.get();
        String resetLink = "http://localhost:3000/login/reset-password?email=" + cleanedEmail;
    
        // Create the content of the email
        String emailContent = "<p>Click the link below to reset your password:</p>"
                + "<a href='" + resetLink + "'>Reset Password</a>";
    
        // Send the email
        emailService.sendEmail(cleanedEmail, "Reset Your Password", emailContent);
    }
    
    
    public void resetPassword(String email, String newPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User with this email does not exist.");
        }
    
        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));  // Encrypt new password
        userRepository.save(user);
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
   
}
