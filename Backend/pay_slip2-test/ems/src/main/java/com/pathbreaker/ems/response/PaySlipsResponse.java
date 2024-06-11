package com.pathbreaker.payslip.response;

import lombok.Data;

@Data
public class PaySlipsResponse {


    private Long id;
    private String employeeId;

    private String month;

    private Long year;

    private String filePaths;
}
