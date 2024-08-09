package com.pb.employee.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUpdateRequest {

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Za-z0-9\\s,.'-]+$", message = "{companyAddress.pattern.message}")
    @Size(min = 1, max = 100, message = "{companyAddress.pattern.message}")
    private String companyAddress;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String mobileNo;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo")
    private String landNo;

    @Pattern(regexp = "^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{companyname.message}")
    private String name;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$", message="{invalid.emailId}")
    private String personalMailId;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String personalMobileNo;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Za-z0-9\\s,.'-]+$", message = "{companyAddress.pattern.message}")
    @Size(min = 1, max = 100, message = "{companyAddress.pattern.message}")
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