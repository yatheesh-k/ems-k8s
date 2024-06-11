package com.pathbreaker.payslip.response;

import lombok.Data;

import java.util.Date;

@Data
public class UserResponse {

    private String userId;

    private String emailId;

    private String userName;

    private String password;

    private String role;

    private int status;

    private Date registrationDate;
    private String ipAddress;

    private UserLoginResponse userLoginResponse;
}
