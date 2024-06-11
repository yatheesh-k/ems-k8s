package com.pathbreaker.payslip.request;

import lombok.Data;

import java.util.Date;

@Data
public class EmployeeUpdateRequest {

    private String employeeType;

    private String firstName;

    private String lastName;

    private String emailId;

    private String password;

    private String designation;

    private Date dateOfHiring;

    private String department;

    private String location;

    private String manager;

    private String role;

    private int status;

    private String panNo;
    private String uanNo;

    private String dateOfBirth;
    private String accountNo;
    private String ifscCode;
    private String bankName;

    private EmployeeLoginRequestUpdate loginRequestUpdate;
}
