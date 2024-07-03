package com.pb.employee.persistance.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class DeductionEntity implements Entity{


    private String pfEmployee;
    private String pfEmployer;
    private String lop;
    private String totalDeductions;

    private String pfTax;
    private String incomeTax;
    private String totalTax;
}