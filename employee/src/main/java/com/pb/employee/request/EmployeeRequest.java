package com.pb.employee.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

    @Pattern(regexp = "^[a-z]+$", message = "{companyName.format}")
    @NotBlank(message = "{companyname.message}")
    private String companyName;

    @Pattern(regexp = "^[a-zA-Z]+( [a-zA-Z]+)*$", message = "{employee.type}")
    @NotBlank(message = "{notnull.message}")
    private String employeeType;

    @Pattern(regexp = "^[A-Z0-9]+$", message = "{employeeId.format}")
    @NotBlank(message = "{notnull.message}")
    private String employeeId;

    @Pattern(regexp = "^[A-Z][a-z]+$", message = "{firstname.format}")
    @NotBlank(message = "{notnull.message}")
    private String firstName;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{lastname.format}")
    @NotBlank(message = "{notnull.message}")
    private String lastName;

    @Pattern(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", message = "{invalid.emailId}")
    @NotBlank(message = "{notnull.message}")
    private String emailId;// "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"

    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{6,16}$", message = "{invalid.password}")
    @NotBlank(message = "{notnull.message}")
    private String password;

    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{designation.format}")
    @NotBlank(message = "{notnull.message}")
    private String designation;

    @Pattern(regexp =  "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "{dateOfHiring.format}")
    @NotBlank(message = "{notnull.message}")
    private String dateOfHiring;

    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*$", message = "{department.format}")
    @NotBlank(message = "{notnull.message}")
    private String department;

    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{location.format}")
    @NotBlank(message = "{notnull.message}")
    private String location;

    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*$", message = "{manager.format}")
    @NotBlank(message = "{notnull.message}")
    private String manager;

    private List<String> roles;

    @Pattern(regexp = "^[A-Z][a-z]+$", message = "{status.format}")
    @NotBlank(message = "{notnull.message}")
    private String status;

    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "{invalid.panNo}")
    @NotBlank(message = "{notnull.message}")
    private String panNo;

    @Pattern(regexp = "^\\d{12}$", message = "{invalid.uanNo}")
    @NotBlank(message = "{notnull.message}")
    private String uanNo;

    @Pattern(regexp = "^\\d{12}$", message = "{invalid.aadhaarId}")
    @NotBlank(message = "{notnull.message}")
    private String aadhaarId;

    @Pattern(regexp =  "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "{dateOfBirth.format}")
    @NotBlank(message = "{notnull.message}")
    private String dateOfBirth;

    @Pattern(regexp = "^\\d{9,18}$", message = "{accountNo.format}")
    @NotBlank(message = "{notnull.message}")
    private String accountNo;

    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "{ifscCode.format}")
    @NotBlank(message = "{notnull.message}")
    private String ifscCode;

    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Za-z&'(),./\\- ]{1,100}$", message = "{bankName.format}")
    @NotBlank(message = "{notnull.message}")
    private String bankName;

}