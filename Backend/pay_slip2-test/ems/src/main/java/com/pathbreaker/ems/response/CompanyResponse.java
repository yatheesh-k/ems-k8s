package com.pathbreaker.payslip.response;


import com.pathbreaker.payslip.entity.Employee;
import lombok.Data;

import java.util.List;

@Data
public class CompanyResponse {

    private String companyId;


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

   // private List<EmployeeAttendanceResponse> employee;
}
