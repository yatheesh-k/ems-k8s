package com.pb.employee.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequest {


    @Pattern(regexp = "^[a-z]+$", message = "{companyName.format}")
    @NotBlank(message = "{companyname.message}")
    private String companyName;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{employee.type}")
    @NotBlank(message = "{notnull.message}")
    private String employeeType;

    @Pattern(regexp = "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", message = "{email.format}")
    @NotBlank(message = "{notnull.message}")
    private String emailId;

    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{designation.format}")
    @NotBlank(message = "{notnull.message}")
    private String designation;

    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{location.format}")
    @NotBlank(message = "{notnull.message}")
    private String location;

    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{manager.format}")
    @NotBlank(message = "{notnull.message}")
    private String manager;


//    @Pattern(regexp = "^[A-Za-z ]+$", message = "{roles.format}")
//    @NotBlank(message = "{notnull.message}")
    private List<String> roles;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{status.format}")
    @NotBlank(message = "{notnull.message}")
    private String status;

    @Pattern(regexp = "^\\d{9,18}$", message = "{accountno.format}")
    @NotBlank(message = "{notnull.message}")
    private String accountNo;

    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "{ifscCode.format}")
    @NotBlank(message = "{notnull.message}")
    private String ifscCode;

    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Za-z&'(),./\\- ]{1,100}$", message = "{bankName.format}")
    @NotBlank(message = "{notnull.message}")
    private String bankName;
}