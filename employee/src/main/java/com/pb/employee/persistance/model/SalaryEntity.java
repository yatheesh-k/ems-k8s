package com.pb.employee.persistance.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SalaryEntity implements Entity{

    private String salaryId;
    private String employeeId;

    private String basicSalary;
    private String fixedAmount;
    private String variableAmount;
    private String grossAmount;
    private String netSalary;
    private AllowanceEntity allowances;
    private DeductionEntity deductions;
    private String type;

}