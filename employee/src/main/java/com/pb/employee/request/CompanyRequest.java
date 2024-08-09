package com.pb.employee.request;


import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {

    @NotNull(message = "{companyname.message}")
    @Pattern(regexp ="^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{companyname.message}")
    private String companyName;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp =  "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", message = "{invalid.emailId}")
    private String emailId;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!])[A-Za-z\\d@#$%^&+=!]{8,}$", message = "{invalid.password}")
    private String password;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{companyAddress.pattern.message}")
    private String companyAddress;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Z0-9\\s]{1,21}$", message = "{companyRegNo.pattern.message}")
    private String companyRegNo;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String mobileNo;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String landNo;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Z0-9\\s]{1,21}$", message = "{invalid.gstNo}")
    private String gstNo;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Z]{5}\\d{4}[A-Z]$", message = "{invalid.panNo}")
    private String panNo;

    @Pattern(regexp = "^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{name.message}")
    private String name;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\\.[a-z]{2,}$", message = "{invalid.emailId}")
    private String personalMailId;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String personalMobileNo;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Za-z0-9\\s,.'-]+$", message = "{companyAddress.pattern.message}")
    @Size(min = 1, max = 100, message = "{companyAddress.pattern.message}")
    private String address;

    private String imageFile;

    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{companyAddress.pattern.message}")
    private String companyType;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Z0-9]{21}$", message = "{invalid.cinNo}")
    private String cinNo;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[a-z]+$", message = "{company.shortname.message}")
    private String shortName;

    private Integer pfPercentage;
    private Integer travelAllowance;
    private Integer specialAllowance;
    private Integer hraPercentage;
    private String companyBranch;
}