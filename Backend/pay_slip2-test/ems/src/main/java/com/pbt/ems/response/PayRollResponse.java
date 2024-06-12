package com.pbt.ems.response;

import lombok.Data;

@Data
public class PayRollResponse {

    private String payRollId;

    private String month;
    private Long year;

    private double incrementAmount;
    private String incrementPurpose;

    private EmployeeAttendanceResponse employee;

}
