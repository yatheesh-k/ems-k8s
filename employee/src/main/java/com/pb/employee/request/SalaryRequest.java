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
    @NotBlank(message = "{basicSalary.message}")
    private String basicSalary;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{fixedAmount.format}")
    @NotBlank(message = "{fixedAmount.message}")
    private String fixedAmount;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{variableAmount.format}")
    @NotBlank(message = "{variableAmount.message}")
    private String variableAmount;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{grossAmount.format}")
    @NotBlank(message = "{grossAmount.message}")
    private String grossAmount;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{totalEarnings.format}")
    @NotBlank(message = "{totalEarnings.message}")
    private String totalEarnings;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{netSalary.format}")
    @NotBlank(message = "{netSalary.message}")
    private String netSalary;

    @Valid
    private AllowanceRequest allowances;

    @Valid
    private DeductionRequest deductions;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{status.format}")
    @NotBlank(message = "{status.message}")
    private String status;
}
