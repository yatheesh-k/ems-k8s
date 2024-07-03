package com.pb.employee.request;


import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest{


    private String company;
    private String employeeId;
    private String month;
    private String year;
    private String totalWorkingDays;
    private String noOfWorkingDays;
    private String type;



}