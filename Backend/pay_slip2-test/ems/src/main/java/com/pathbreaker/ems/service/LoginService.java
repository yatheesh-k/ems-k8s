package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.request.LoginRequest;
import org.springframework.http.ResponseEntity;


public interface LoginService {

    ResponseEntity<?> sendOtpToEmail(LoginRequest request);

    ResponseEntity<?> loginAdmin(LoginRequest loginRequest);
}
