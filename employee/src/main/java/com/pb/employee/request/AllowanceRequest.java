package com.pb.employee.request;


import com.pb.employee.persistance.model.Entity;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AllowanceRequest {


    private Double travelAllowance;
    private Double pfContributionEmployee;
    private Double hra;
    private Double specialAllowance;
    private Double otherAllowances;

}