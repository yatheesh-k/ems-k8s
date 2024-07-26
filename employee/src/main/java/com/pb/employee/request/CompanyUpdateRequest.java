package com.pb.employee.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUpdateRequest {

    private String companyAddress;
    private String mobileNo;
    private String landNo;
    private String name;
    private String personalMailId;
    private String personalMobileNo;
    private String address;
    private String companyType;
    private String companyBranch;
    private Long pfPercentage;
    private Long travelAllowance;
    private Long specialAllowance;
    private Long hraPercentage;
}