package com.pb.employee.request;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pb.employee.persistance.model.Entity;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class OfferLetterRequest {


    private String offerDate;
    private String referenceNo;
    private String employeeName;
    private String employeeFatherName;
    private String employeeAddress;
    private String employeeFirstName;
    private String employeeContactNo;
    private String joiningDate;
    private String jobLocation;
    private String grossCompensation;
    private String cinNo;
    private String companyId;
    private String salaryConfigurationId;
    private String employeePosition;

}