package com.pb.employee.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowanceRequest {

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Travel Allowance must be a numeric value with up to two decimal places")
    private String travelAllowance;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "PF Contribution Employee must be a numeric value with up to two decimal places")
    private String pfContributionEmployee;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "HRA must be a numeric value with up to two decimal places")
    private String hra;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Special Allowance must be a numeric value with up to two decimal places")
    private String specialAllowance;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "Other Allowances must be a numeric value with up to two decimal places")
    private String otherAllowances;
}
