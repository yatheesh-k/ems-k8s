package com.pbt.ems.request;

import lombok.Data;

import java.util.Date;

@Data
public class UserUpdateRequest {

    private String emailId;

    private String userName;

    private String password;

    private String role;

    private int status;
    private String ipAddress;
    private Date registrationDate;

    private UserLoginUpdateRequest userLoginUpdateRequest;
}
