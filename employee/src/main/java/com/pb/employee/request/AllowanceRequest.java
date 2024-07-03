package com.pb.employee.request;


import com.pb.employee.persistance.model.Entity;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowanceRequest {


    private String travelAllowance;
    private String hra;
    private String specialAllowance;
    private String otherAllowances;

}