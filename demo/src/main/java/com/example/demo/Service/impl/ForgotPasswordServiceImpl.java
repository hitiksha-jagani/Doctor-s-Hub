package com.example.demo.Service.impl;

import com.example.demo.DTO.ForgotPasswordRequestDTO;
import com.example.demo.DTO.ResetPasswordRequestDTO;
import com.example.demo.Model.User;
import com.example.demo.Repository.UserRepository;
import com.example.demo.Service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void forgotPassword(ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        Optional<User> userOptional = userRepository.findByEmail(forgotPasswordRequestDTO.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User with this email does not exist.");
        }

        // You can send an email here OR just allow to reset password directly
        System.out.println("Password reset request received for email: " + forgotPasswordRequestDTO.getEmail());
    }

    @Override
    public void resetPassword(ResetPasswordRequestDTO resetPasswordRequestDTO) {
        Optional<User> userOptional = userRepository.findByEmail(resetPasswordRequestDTO.getEmail());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User with this email does not exist.");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(resetPasswordRequestDTO.getNewPassword()));
        userRepository.save(user);
    }
}

