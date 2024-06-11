package com.pathbreaker.payslip.request;

import lombok.Data;

@Data
public class LoginRequest {

    private String emailId;

    private String password;

    private Long otp;

}
