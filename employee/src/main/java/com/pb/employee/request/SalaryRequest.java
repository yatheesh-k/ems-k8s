package com.pb.employee.request;


import com.pb.employee.persistance.model.AllowanceEntity;
import com.pb.employee.persistance.model.DeductionEntity;
import com.pb.employee.persistance.model.Entity;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
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