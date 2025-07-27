package com.example.demo.Service;

import com.example.demo.DTO.ForgotPasswordRequestDTO;
import com.example.demo.DTO.ResetPasswordRequestDTO;

public interface ForgotPasswordService {
    void forgotPassword(ForgotPasswordRequestDTO forgotPasswordRequestDTO);
    void resetPassword(ResetPasswordRequestDTO resetPasswordRequestDTO);
}

