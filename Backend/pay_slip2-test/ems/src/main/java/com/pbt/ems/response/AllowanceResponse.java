package com.pbt.ems.response;

import lombok.Data;

@Data
public class AllowanceResponse {

    private String allowanceId;

    private Double basicSalary;
    private Double travelAllowance;
    private Double pfContributionEmployee;
    private Double hra;
    private Double specialAllowance;
    private Double totalEarnings;
    private Double otherAllowances;

}


