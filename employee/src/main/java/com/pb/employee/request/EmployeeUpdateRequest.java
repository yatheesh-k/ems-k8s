package com.pb.employee.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequest {
    @NotBlank(message = "{companyname.message}")
    private String companyName;
    private String employeeType;
    private String emailId;
    private String password;
    private String designation;
    private String location;
    private String manager;
    private List<String> roles;
    private int status;
    private String accountNo;
    private String ifscCode;
    private String bankName;
}