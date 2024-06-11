package com.pathbreaker.payslip.response;

import lombok.Data;

import java.util.Date;

@Data
public class EmployeeSalaryResponse {

    private String employeeId;
    private String employeeName;
    private Long totalWorkingDays;
    private Long lop;
    private Double netSalary;
    private String month;
    private Long year;
}
