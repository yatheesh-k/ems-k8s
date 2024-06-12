package com.pbt.ems.request;

import lombok.Data;

@Data
public class PayRollRequest {

    private String month;
    private Long year;


    private double incrementAmount;
    private String incrementPurpose;

}
