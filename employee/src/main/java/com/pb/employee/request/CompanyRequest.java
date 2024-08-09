package com.pb.employee.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {

    @Schema(example = "companyName")
    @Size(min = 2, max = 20, message = "{size.message}")
    @Pattern(regexp ="^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{companyname.message}")
    private String companyName;

    @Schema(example = "emailId")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp =  "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,6}$", message = "{invalid.emailId}")
    private String emailId;

    @Schema(example = "password")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!])[A-Za-z\\d@#$%^&+=!]{8,}$", message = "{invalid.password}")
    private String password;

    @Schema(example = "companyAddress")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{companyAddress.pattern.message}")
    private String companyAddress;

    @Schema(example = "companyRegNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Z0-9\\s]{1,21}$", message = "{companyRegNo.pattern.message}")
    private String companyRegNo;

    @Schema(example = "mobileNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String mobileNo;

    @Schema(example = "landNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String landNo;

    @Schema(example = "gstNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[A-Z0-9\\s]{1,21}$", message = "{invalid.gstNo}")
    private String gstNo;

    @Schema(example = "panNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Z]{5}\\d{4}[A-Z]$", message = "{invalid.panNo}")
    private String panNo;

    @Schema(example = "name")
    @Size(min = 3, max = 20, message = "{size.message}")
    @Pattern(regexp = "^[A-Za-z]+(?:\\s[A-Za-z]+)*$", message = "{name.message}")
    private String name;

    @Schema(example = "personalMailId")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\\.[a-z]{2,}$", message = "{invalid.emailId}")
    private String personalMailId;

    @Schema(example = "personalMobileNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d{10}$", message = "{invalid.mobileNo}")
    private String personalMobileNo;

    @Schema(example = "address")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Za-z0-9\\s,.'-]+$", message = "{companyAddress.pattern.message}")
    @Size(min = 1, max = 100, message = "{companyAddress.pattern.message}")
    private String address;

    private String imageFile;

    @Schema(example = "companyType")
    @Pattern(regexp = "^(?!\\s)(?!.*\\s$)[a-zA-Z0-9\\s,'#,&*()^\\-/]*$", message = "{companyAddress.pattern.message}")
    private String companyType;

    @Schema(example = "cinNo")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Z0-9]{21}$", message = "{invalid.cinNo}")
    private String cinNo;



    @Schema(example = "shortName")
    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[a-z]+$", message = "{company.shortname.message}")
    @Size(min = 2, max = 20, message = "{size.message}")
    private String shortName;



    private Integer pfPercentage;
    private Integer travelAllowance;
    private Integer specialAllowance;
    private Integer hraPercentage;

    private String companyBranch;
}