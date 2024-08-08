package com.pb.employee.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowanceRequest {

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{travelAllowance.format}")
    private String travelAllowance;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{pfContributionEmployee.format}")
    private String pfContributionEmployee;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{hra.format}")
    private String hra;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{specialAllowance.format}")
    private String specialAllowance;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{otherAllowances.format}")
    private String otherAllowances;
}
