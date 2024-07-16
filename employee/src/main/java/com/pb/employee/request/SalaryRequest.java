package com.pb.employee.request;


import jakarta.validation.constraints.NotBlank;

import lombok.*;
import lombok.experimental.SuperBuilder;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryRequest{
    

    @NotBlank(message = "{companyname.message}")
    private String companyName;
    private String basicSalary;
    private String fixedAmount;
    private String variableAmount;
    private String grossAmount;
    private String totalEarnings;
    private String netSalary;

    private AllowanceRequest allowances;
    private DeductionRequest deductions;
    private int status;
}