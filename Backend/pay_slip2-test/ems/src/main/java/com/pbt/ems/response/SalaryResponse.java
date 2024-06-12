package com.pbt.ems.response;

import com.pbt.ems.entity.Allowances;
import com.pbt.ems.request.AttendanceRequest;
import lombok.Data;

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


