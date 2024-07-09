package com.pb.ems.service;

import com.pb.ems.exception.IdentityException;
import com.pb.ems.model.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;


public interface LoginService {

    ResponseEntity<?> login(LoginRequest request) throws IdentityException;
    ResponseEntity<?> updateEmsAdmin(LoginRequest request) throws IdentityException;
    ResponseEntity<?> employeeLogin(EmployeeLoginRequest request) throws IdentityException;

    ResponseEntity<?> logout(OTPRequest loginRequest);

    ResponseEntity<?> validateCompanyOtp(OTPRequest request) throws  IdentityException;

    ResponseEntity<?> forgotPassword(EmployeePasswordRequest loginRequest) throws IdentityException;

    ResponseEntity<?> updatePasswordForForgot(@Valid EmployeePasswordforgot otpRequest) throws IdentityException;
}
