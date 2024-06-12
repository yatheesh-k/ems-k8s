package com.pb.ems.service;

import com.pb.ems.exception.IdentityException;
import com.pb.ems.model.LoginRequest;
import com.pb.ems.model.OTPRequest;
import org.springframework.http.ResponseEntity;


public interface LoginService {

    ResponseEntity<?> login(LoginRequest request) throws IdentityException;

    ResponseEntity<?> logout(OTPRequest loginRequest);
}
