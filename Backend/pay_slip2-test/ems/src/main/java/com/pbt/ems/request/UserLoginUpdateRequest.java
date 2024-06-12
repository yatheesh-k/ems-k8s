package com.pbt.ems.request;

import lombok.Data;

import java.util.Date;

@Data
public class UserLoginUpdateRequest {

    private String emailId;

    private String userName;

    private String password;

    private String otp;

    private String role;

    private Date lastLoginTime;

}
