package com.pathbreaker.payslip.response;

import com.pathbreaker.payslip.entity.Employee;
import lombok.Data;

import java.util.Date;

@Data
public class PayRollResponse {

    private String payRollId;

    private String month;
    private Long year;

    private double incrementAmount;
    private String incrementPurpose;

    private EmployeeAttendanceResponse employee;

}
