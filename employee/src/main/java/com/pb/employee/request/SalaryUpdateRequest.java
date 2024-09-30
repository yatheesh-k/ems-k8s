package com.pb.employee.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryUpdateRequest {

    private String companyName;
    private String fixedAmount;
    private String variableAmount;
    private SalaryConfigurationUpdate salaryConfigurationRequest;
    private String grossAmount;
    private String status;
}
