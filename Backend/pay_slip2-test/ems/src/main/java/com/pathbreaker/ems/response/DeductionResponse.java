package com.pathbreaker.payslip.response;

import lombok.Data;

@Data
public class DeductionResponse {

    private String deductionId;
    private Double pfEmployee;
    private Double pfEmployer;
    private Double lop;
    private Double pfTax;
    private Double incomeTax;
    private Double totalDeductions;
    private Double netSalary;
    private Double totalTax;

}


