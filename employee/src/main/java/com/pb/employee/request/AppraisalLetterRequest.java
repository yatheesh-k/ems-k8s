package com.pb.employee.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AppraisalLetterRequest {

    private String companyId;
    private String SalaryConfigurationId;
    private String employeeId;
    private String date;
    private String dateOfSalaryIncrement;
    private Double grossCompensation;
}
