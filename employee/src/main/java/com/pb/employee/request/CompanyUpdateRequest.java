package com.pb.employee.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUpdateRequest {

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Za-z0-9\\s]+$", message = "{companyAddress.pattern.message}")
    private String companyAddress;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String mobileNo;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo")
    private String landNo;
    @Pattern(regexp = "^[A-Za-z]+$", message = "{companyname.message}")
    private String name;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp="^[a-z]*@\\.$", message="{invalid.emailId}")
    private String personalMailId;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String personalMobileNo;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Za-z]+$", message = "{companyAddress.pattern.message}")
    private String address;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{company.type}")
    private String companyType;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^[a-zA-Z]+$", message = "{companyBranch.pattern.message}")
    private String companyBranch;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{0,9}$", message = "{invalid.pf}")
    private Long pfPercentage;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{0,9}$", message = "{travelAllowance.format}")
    private Long travelAllowance;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{0,9}$", message = "{specialAllowance.format}")
    private Long specialAllowance;

    @NotBlank(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{0,9}$", message = "{invalid.hra}")
    private Long hraPercentage;
}