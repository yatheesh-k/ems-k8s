package com.pathbreaker.payslip.request;

import lombok.Data;

@Data
public class RelievingRequest {


    private String employeeId;
    private String designation;
    private String typeOfEmployement;
    private String resignationDate;
    private String lastWorkingDate;


}
