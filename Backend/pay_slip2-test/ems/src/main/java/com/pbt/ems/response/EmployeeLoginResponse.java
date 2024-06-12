package com.pbt.ems.response;

import lombok.Data;

import java.util.Date;

@Data
public class EmployeeLoginResponse {

    private int id;

    private int otp;

    private String emailId;

    private String password;

    private int status;

    private Date lastLoginTime;

    private String role;

    private String ipAddress;

}
