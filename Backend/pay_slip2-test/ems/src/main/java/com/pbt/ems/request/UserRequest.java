package com.pbt.ems.request;

import com.pbt.ems.entity.Company;
import com.pbt.ems.entity.UserLogin;
import lombok.Data;

import java.util.Date;

@Data
public class UserRequest {

    private String userId;

    private String emailId;

    private String userName;

    private String password;

    private String role;

    private int status;
    private String ipAddress;

    private Date registrationDate;

    private UserLogin userLogin;
    private Company company;

}
