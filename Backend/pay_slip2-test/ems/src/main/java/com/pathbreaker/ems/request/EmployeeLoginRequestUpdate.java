package com.pathbreaker.payslip.request;

import lombok.Data;

@Data
public class EmployeeLoginRequestUpdate {

    private String emailId;

    private String password;

    private int status;

    private String role;

    private String ipAddress;

}
