package com.pathbreaker.payslip.response;

import com.pathbreaker.payslip.entity.Allowances;
import com.pathbreaker.payslip.entity.Deductions;
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


