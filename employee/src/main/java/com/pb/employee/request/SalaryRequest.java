package com.pb.employee.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRequest {

    @Pattern(regexp = "^[a-z]+$", message = "{companyName.format}")
    @NotBlank(message = "{companyname.message}")
    private String companyName;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{basicSalary.format}")
    @NotBlank(message = "{notnull.message}")
    private String basicSalary;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{fixedAmount.format}")
    @NotBlank(message = "{notnull.message}")
    private String fixedAmount;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{variableAmount.format}")
    @NotBlank(message = "{notnull.message}")
    private String variableAmount;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{grossAmount.format}")
    @NotBlank(message = "{notnull.message}")
    private String grossAmount;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{totalEarnings.format}")
    @NotBlank(message = "{notnull.message}")
    private String totalEarnings;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{netSalary.format}")
    @NotBlank(message = "{notnull.message}")
    private String netSalary;

    @Valid
    private AllowanceRequest allowances;

    @Valid
    private DeductionRequest deductions;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{status.format}")
    @NotBlank(message = "{notnull.message}")
    private String status;
}
