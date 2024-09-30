package com.pb.employee.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeSalaryRequest {

    private String companyName;
    private String fixedAmount;
    private String variableAmount;
    private String grossAmount;
    private String status;
    }
