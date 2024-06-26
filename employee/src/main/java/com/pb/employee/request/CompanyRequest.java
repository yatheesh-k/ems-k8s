package com.pb.employee.request;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyRequest {

    @NotBlank(message = "{companyname.missing.message}")
    private String companyName;
    private String emailId;
    private String password;
    private String companyAddress;
    private String companyRegNo;
    private String mobileNo;
    private String landNo;
    private String gstNo;
    private String panNo;
    private String name;
    private String personalMailId;
    private String personalMobileNo;
    private String address;
    private String imageFile;
    private String companyType;
    private String companyBranch;
    private String cinNo;
    private Long pfPercentage;
    private Long travelAllowance;
    private Long specialAllowance;
    private Long hraPercentage;
    private String shortName;
}