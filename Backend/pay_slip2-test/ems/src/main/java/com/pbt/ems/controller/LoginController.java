package com.pbt.ems.controller;

import com.pbt.ems.request.LoginRequest;
import com.pbt.ems.service.LoginService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody LoginRequest request) {
            return loginService.sendOtpToEmail(request);
        }
    @PostMapping("/validate-otp")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequest loginRequest) {
        return loginService.loginAdmin(loginRequest);
    }



}
