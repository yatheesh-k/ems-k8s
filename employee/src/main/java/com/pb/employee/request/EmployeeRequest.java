package com.pb.employee.request;


import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

    private String companyName;
    private String employeeType;
    private String employeeId;
    private String firstName;
    private String lastName;
    private String emailId;
    private String password;
    private String designation;
    private String dateOfHiring;
    private String department;
    private String location;
    private String manager;
    private List<String> roles;
    private String status;
    private String panNo;
    private String uanNo;
    private String aadhaarId;
    private String dateOfBirth;
    private String accountNo;
    private String ifscCode;
    private String bankName;
}