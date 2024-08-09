package com.pb.employee.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowanceRequest {

    @Schema(example = "travelAllowance")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{travelAllowance.format}")
    @Size(min = 3, max = 10, message = "{size.message}")
    private String travelAllowance;

    @Schema(example = "pfContributionEmployee")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{pfContributionEmployee.format}")
    @Size(min = 3, max = 10, message = "{size.message}")
    private String pfContributionEmployee;

    @Schema(example = "hra")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{hra.format}")
    @Size(min = 1, max = 2, message = "{size.message}")
    private String hra;

    @Schema(example = "specialAllowance")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{specialAllowance.format}")
    @Size(min = 3, max = 10, message = "{size.message}")
    private String specialAllowance;

    @Schema(example = "otherAllowances")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{otherAllowances.format}")
    @Size(min = 3, max = 10, message = "{size.message}")
    private String otherAllowances;
}
