package com.pathbreaker.payslip.response;

import lombok.Data;

@Data
public class RelievingReponse {

    private int id;

    private String employeeId;
    private String designation;
    private String firstName;
    private String lastName;
    private String typeOfEmployement;
    private String resignationDate;
    private String lastWorkingDate;


}
