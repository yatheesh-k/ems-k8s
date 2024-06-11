package com.pathbreaker.payslip.response;

import lombok.Data;

@Data
public class AttendanceResponse {

    private String attendanceId;
    private String month;
    private Long year;
    private Long totalWorkingDays;
    private Long lop;
    private EmployeeAttendanceResponse employee;


}


