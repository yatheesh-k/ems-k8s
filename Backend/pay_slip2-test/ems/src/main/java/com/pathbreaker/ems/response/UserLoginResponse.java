package com.pathbreaker.payslip.response;

import lombok.Data;

import java.util.Date;

@Data
public class UserLoginResponse {

    private Long id;

    private String emailId;

    private String userName;

    private String password;

    private String role;

    private Date lastLoginTime;

}
