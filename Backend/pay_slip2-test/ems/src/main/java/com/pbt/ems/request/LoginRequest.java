package com.pbt.ems.request;

import lombok.Data;

@Data
public class LoginRequest {

    private String emailId;

    private String password;

    private Long otp;

}
