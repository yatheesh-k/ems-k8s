package com.pathbreaker.payslip.request;

import com.pathbreaker.payslip.entity.Allowances;
import com.pathbreaker.payslip.entity.Deductions;
import com.pathbreaker.payslip.entity.Employee;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
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


