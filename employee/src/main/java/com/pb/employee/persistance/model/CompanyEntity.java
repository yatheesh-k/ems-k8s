package com.pb.employee.persistance.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyEntity implements Entity{

    private String companyName;
    private String emailId;
    private String password;
    private String companyAddress;
    private String companyRegNo;
    private String mobileNo;
    private String landNo;
    private String gstNo;
    private String panNo;
    private String personalMailId;
    private String personalMobileNo;
    private String address;
    private String imageFile;
    private String companyType;
    private String companyBranch;
    private String cinNo;
    private String pfPercentage;
    private String travelAllowance;
    private String specialAllowance;
    private String hraPercentage;
    private String shortName;
    private String type;

}
