package com.pb.employee.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {

    @Schema(example = "companyShortName")
    @Pattern(regexp = "^[a-z]+$", message = "{companyName.format}")
    @NotBlank(message = "{companyname.message}")
    @Size(min = 2, max = 20, message = "{size.message}")
    private String companyName;

    @Schema(example = "employeeId")
    @Pattern(regexp = "^[a-zA-Z]+( [a-zA-Z]+)*$", message = "{employee.type}")
    @NotBlank(message = "{notnull.message}")
    @Size(min = 3, max = 20, message = "{size.message}")
    private String employeeType;

    @Pattern(regexp = "^[A-Z0-9]+$", message = "{employeeId.format}")
    @NotBlank(message = "{notnull.message}")
    @Size(min = 2, max = 20, message = "{size.message}")
    private String employeeId;

    @Schema(example = "firstName")
    @Pattern(regexp = "^[A-Z][a-z]+$", message = "{firstname.format}")
    @NotBlank(message = "{notnull.message}")
    @Size(min = 3, max = 20, message = "{size.message}")
    private String firstName;

    @Schema(example = "lastName")
    @Pattern(regexp = "^[A-Za-z]+$", message = "{lastname.format}")
    @NotBlank(message = "{notnull.message}")
    @Size(min = 1, max = 20, message = "{size.message}")
    private String lastName;


    @Pattern(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", message = "{invalid.emailId}")
    @NotBlank(message = "{notnull.message}")
    private String emailId;// "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$"

    @Schema(example = "password")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\\W)(?!.* ).{6,16}$", message = "{invalid.password}")
    @NotBlank(message = "{notnull.message}")
    private String password;

    @Schema(example = "designation")
    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{designation.format}")
    @Size(min = 2, max = 20, message = "{size.message}")
    private String designation;

    @Schema(example = "dateOfHiring")
    @Pattern(regexp =  "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "{dateOfHiring.format}")
    @NotBlank(message = "{notnull.message}")
    private String dateOfHiring;

    @Schema(example = "department")
    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{department.format}")
    @Size(min = 2, max = 20, message = "{size.message}")
    private String department;

    @Schema(example = "location")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Za-z0-9\\s,'#,&*()^\\-/]*$", message = "{location.format}")
    @NotBlank(message = "{notnull.message}")
    private String location;

    @Schema(example = "manager")
    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*$", message = "{manager.format}")
    @Size(min = 3, max = 30, message = "{size.message}")
    private String manager;

    @NotNull(message = "{roles.format}")
    @Size(min = 1, message = "{roles.size}")
    private List<@NotBlank(message = "{role.notnull}")
    @Pattern(regexp = "^[A-Z][a-z]+$", message = "{roles.format}") String> roles;



    @Schema(example = "status")
    @Pattern(regexp = "^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{status.format}")
    @NotBlank(message = "{notnull.message}")
    private String status;


    @Schema(example = "panNo")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "{invalid.panNo}")
    @NotBlank(message = "{notnull.message}")
    private String panNo;

    @Schema(example = "uanNo")
    @Pattern(regexp = "^\\d{12}$", message = "{invalid.uanNo}")
    @NotBlank(message = "{notnull.message}")
    private String uanNo;

    @Schema(example = "aadhaarId")
    @Pattern(regexp = "^\\d{12}$", message = "{invalid.aadhaarId}")
    @NotBlank(message = "{notnull.message}")
    private String aadhaarId;

    @Schema(example = "status")
    @Pattern(regexp =  "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "{dateOfBirth.format}")
    @NotBlank(message = "{notnull.message}")
    private String dateOfBirth;

    @Schema(example = "accountNo")
    @Pattern(regexp = "^\\d{9,18}$", message = "{accountNo.format}")
    @NotBlank(message = "{notnull.message}")
    private String accountNo;

    @Schema(example = "ifscCode")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "{ifscCode.format}")
    @NotBlank(message = "{notnull.message}")
    private String ifscCode;

    @Schema(example = "bankName")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Za-z&'(),./\\- ]{1,100}$", message = "{bankName.format}")
    @NotBlank(message = "{notnull.message}")
    @Size(min = 3, max = 20, message = "{size.message}")
    private String bankName;

}