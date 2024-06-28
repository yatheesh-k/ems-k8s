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

    @NotBlank(message = "{companyname.message}")
    private String companyName;
    private Double pfEmployee;
    private Double pfEmployer;
    private Double totalTax;

    private Double lop;
    private Double pfTax;
    private Double incomeTax;
    private Double totalDeductions;


}