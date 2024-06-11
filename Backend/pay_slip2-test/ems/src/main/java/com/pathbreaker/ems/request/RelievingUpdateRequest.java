package com.pathbreaker.payslip.request;

import lombok.Data;

@Data
public class RelievingUpdateRequest {


    private String designation;
    private String typeOfEmployement;
    private String resignationDate;
    private String lastWorkingDate;


}
