package com.pbt.ems.service;

import com.pbt.ems.request.LoginRequest;
import org.springframework.http.ResponseEntity;


public interface LoginService {

    ResponseEntity<?> sendOtpToEmail(LoginRequest request);

    ResponseEntity<?> loginAdmin(LoginRequest loginRequest);
}
