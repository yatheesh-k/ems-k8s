package com.pb.employee.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUpdateRequest {

    @Schema(example = "companyAddress")
    @Pattern(regexp = "^(?:\\d*\\s*)?(?:[A-Z][a-zA-Z]*(?:[\\d*\\s',.#&*()^\\-/]+[A-Z][a-zA-Z]*)*)+(?:[\\s]*\\d*)?\\.?$", message = "{companyAddress.pattern.message}")
    @Size(min = 1, max = 100, message = "{companyAddress.notnull.message}")
    private String companyAddress;

    @Schema(example = "mobileNo")
    @NotBlank(message = "{mobileNo.notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String mobileNo;

    @Schema(example = "landNo")
    @NotBlank(message = "{landNo.notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo")
    private String landNo;

    @Schema(example = "name")
    @Size(min = 3, max = 20, message = "{name.notnull.message}")
    @Pattern(regexp = "^[A-Z][a-z]+(?:\\s[A-Z][A-Za-z]*)*$", message = "{name.message}")
    private String name;

    @Schema(example = "personalMailId")
    @NotBlank(message = "{personalMailId.notnull.message}")
    @Pattern(regexp="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", message="{invalid.emailId}")
    private String personalMailId;

    @Schema(example = "personalMobileNo")
    @NotBlank(message = "{personalMobileNo.notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String personalMobileNo;

    @Schema(example = "address")
    @Pattern(regexp = "^(?:\\d*\\s*)?(?:[A-Z][a-zA-Z]*(?:[\\d*\\s',.#&*()^\\-/]+[A-Z][a-zA-Z]*)*)+(?:[\\s]*\\d*)?\\.?$", message = "{companyAddress.pattern.message}")
    @Size(min = 1, max = 100, message = "{address.notnull.message}")
    private String address;

//    @Pattern(regexp = "^[A-Za-z]+$", message = "{company.type}")
    private String companyType;

//    @NotBlank(message = "{notnull.message}")
//    @Pattern(regexp = "^[a-zA-Z]+$", message = "{companyBranch.pattern.message}")
    private String companyBranch;

//    @NotNull(message = "{notnull.message}")
//    @PositiveOrZero(message =  "{invalid.pf}")
//    @Max(value = 100, message ="{invalid.pf}")
    private Long pfPercentage;

//    @NotNull(message = "{notnull.message}")
//    @PositiveOrZero(message = "{travelAllowance.format}")
//    @Max(value = 99999, message = "{travelAllowance.format}")
    private Long travelAllowance;

//    @NotNull(message = "{notnull.message}")
//    @PositiveOrZero(message = "{specialAllowance.format}")
//    @Max(value = 99999, message = "{specialAllowance.format}")
    private Long specialAllowance;

//    @NotNull(message = "{notnull.message}")
//    @PositiveOrZero(message = "{invalid.hra}")
//    @Max(value = 100, message = "{invalid.hra}")
    private Long hraPercentage;
}