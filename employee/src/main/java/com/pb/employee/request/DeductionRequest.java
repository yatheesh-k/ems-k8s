package com.pb.employee.request;


import com.pb.employee.persistance.model.Entity;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeductionRequest {

    private Double pfEmployee;
    private Double pfEmployer;
    private Double totalTax;

    private Double lop;
    private Double pfTax;
    private Double incomeTax;
    private Double totalDeductions;


}