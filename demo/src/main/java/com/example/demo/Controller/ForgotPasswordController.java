package com.example.demo.Controller;

import com.example.demo.DTO.ForgotPasswordRequestDTO;
import com.example.demo.DTO.ResetPasswordRequestDTO;
import com.example.demo.Service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/auth")
public class ForgotPasswordController {

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        forgotPasswordService.forgotPassword(forgotPasswordRequestDTO);
        return "Password reset link sent (or proceed to reset password)";
    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        forgotPasswordService.resetPassword(resetPasswordRequestDTO);
        return "Password reset successfully!";
    }
}
