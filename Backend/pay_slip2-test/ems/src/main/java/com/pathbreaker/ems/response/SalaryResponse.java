package com.pathbreaker.payslip.response;

import com.pathbreaker.payslip.entity.Allowances;
import com.pathbreaker.payslip.entity.Deductions;
import com.pathbreaker.payslip.request.AttendanceRequest;
import lombok.Data;

import java.util.List;

@Data
public class SalaryResponse {

    private String salaryId;

    private Double fixedAmount;
    private Double variableAmount;
    private Double grossAmount;

    private AllowanceResponse allowances;
    private DeductionResponse deductions;
    private EmployeeAttendanceResponse employee;



}


