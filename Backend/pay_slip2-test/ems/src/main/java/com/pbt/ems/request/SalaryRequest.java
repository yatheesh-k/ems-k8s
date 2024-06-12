package com.pbt.ems.request;

import com.pbt.ems.entity.Allowances;
import com.pbt.ems.entity.Deductions;
import lombok.Data;

@Data
public class SalaryRequest {

    private String salaryId;

    private Double fixedAmount;
    private Double variableAmount;
    private Double grossAmount;

    private Allowances allowances;
    private Deductions deductions;


}


