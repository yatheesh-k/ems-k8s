package com.pb.employee.request;


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
    private Double basicSalary;
    private Double fixedAmount;
    private Double variableAmount;
    private Double grossAmount;
    private Double totalEarnings;
    private Double netSalary;

    private AllowanceRequest allowances;
    private DeductionRequest deductions;
    private int status;
    private String type;

}