package com.pb.employee.request;


import com.pb.employee.persistance.model.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeductionRequest {


    private String pfEmployee;
    private String pfEmployer;
    private String lop;
    private String totalDeductions;

    private String pfTax;
    private String totalTax;



}