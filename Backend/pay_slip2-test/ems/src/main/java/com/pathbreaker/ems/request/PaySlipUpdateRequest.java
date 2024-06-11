package com.pathbreaker.payslip.request;

import lombok.Data;

@Data
public class PaySlipUpdateRequest {


    private String month;

    private Long financialYear;

}
