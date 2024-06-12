package com.pbt.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Salary")
public class Salary {

    @Id
    private String salaryId;

    private Double fixedAmount;
    private Double variableAmount;
    private Double grossAmount;

    @ManyToOne
    @JoinColumn(name = "employeeId")
    private Employee employee;

    @OneToOne
    @JoinColumn(name = "allowanceId")
    private Allowances allowances;

    @OneToOne
    @JoinColumn(name = "deductionId")
    private Deductions deductions;
}


