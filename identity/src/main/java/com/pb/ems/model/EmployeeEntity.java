package com.pb.ems.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.pb.ems.persistance.Entity;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
@JsonIgnoreProperties
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeEntity implements Entity {
    private String resourceId;
    private String employeeType;
    private String type;
    private String emailId;
    private String password;
    private String companyId;
    private String status;

    private String employeeId;
    private String firstName;
    private String lastName;
    private String designation;
    private Date dateOfHiring;
    private String department;
    private String location;
    private String manager;
    private String role;
    private String panNo;
    private String uanNo;
    private String dateOfBirth;
    private String accountNo;
    private String ifscCode;
    private String bankName;
}
