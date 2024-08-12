package com.pb.employee.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeUpdateRequest {


    @Schema(example = "companyShortName")
    @Pattern(regexp = "^[a-z]+$", message = "{companyName.format}")
    @NotBlank(message = "{companyname.message}")
    @Size(min = 2, max = 20, message = "{size.message}")
    private String companyName;

    @Schema(example = "employeeType")
    @Pattern(regexp = "^[A-Z][a-z]+$", message = "{employee.type}")
    @Size(min = 3, max = 20, message = "{employeeType.size.message}")
    private String employeeType;

    @Schema(example = "emailId")
    @Pattern(regexp = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", message = "{invalid.emailId}")
    @NotBlank(message = "{emailId.notnull.message}")
    private String emailId;

    @Schema(example = "designation")
    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*$", message = "{designation.format}")
    @Size(min = 2, max = 20, message = "{designation.size.message}")
    private String designation;

    @Schema(example = "location")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{location.format}")
    @NotBlank(message = "{location.notnull.message}")
    private String location;

    @Schema(example = "manager")
    @Pattern(regexp = "^(?!.*[\\s]{2})(?!.*\\s$)(?!^\\s)(?!.*\\d.*)[A-Z][a-z]+(?:\\s[A-Z][a-z]+)*$", message = "{manager.format}")
    @Size(min = 3, max = 30, message = "{manager.notnull.message}")
    private String manager;

    @NotNull(message = "{roles.format}")
    @Size(min = 1, message = "{roles.size}")
    private List<@NotBlank(message = "{role.notnull.message}")
    @Pattern(regexp = "^[A-Z][a-z]+$", message = "{roles.format}") String> roles;

    @Schema(example = "status")
    @Pattern(regexp = "^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{status.format}")
    @NotBlank(message = "{status.notnull.message}")
    private String status;

    @Schema(example = "accountNo")
    @Pattern(regexp = "^\\d{9,18}$", message = "{accountno.format}")
    @NotBlank(message = "{accountNo.notnull.message}")
    private String accountNo;

    @Schema(example = "ifscCode")
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "{ifscCode.format}")
    @NotBlank(message = "{ifscCode.notnull.message}")
    private String ifscCode;

    @Schema(example = "bankName")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Za-z&'(),./\\- ]{1,100}$", message = "{bankName.format}")
    @Size(min = 3, max = 20, message = "{bankName.size.message}")
    private String bankName;
}