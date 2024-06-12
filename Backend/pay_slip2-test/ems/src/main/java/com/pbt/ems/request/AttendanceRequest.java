package com.pbt.ems.request;

import lombok.Data;

@Data
public class AttendanceRequest {

    private String month;
    private Long year;
    private Long totalWorkingDays;
    private Long lop;

}


