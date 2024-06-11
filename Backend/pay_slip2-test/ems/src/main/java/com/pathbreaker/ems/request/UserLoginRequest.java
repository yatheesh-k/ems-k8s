package com.pathbreaker.payslip.request;

import com.pathbreaker.payslip.entity.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class UserLoginRequest {

    private String emailId;

    private String userName;

    private String password;

    private String otp;

    private String role;

    private Date lastLoginTime;

    private User userEntity;

    private LocalDateTime expiryTime;
}
