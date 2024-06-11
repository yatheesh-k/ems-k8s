package com.pathbreaker.payslip.request;

import com.pathbreaker.payslip.entity.Employee;
import lombok.Data;

import java.util.Date;

@Data
public class PayRollRequest {

    private String month;
    private Long year;


    private double incrementAmount;
    private String incrementPurpose;

}
