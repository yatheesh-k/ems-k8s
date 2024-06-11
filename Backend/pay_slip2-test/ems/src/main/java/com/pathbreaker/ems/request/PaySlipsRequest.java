package com.pathbreaker.payslip.request;

import lombok.Data;

@Data
public class PaySlipsRequest {

    private String month;

    private Long year;

    private String filePaths;
}
