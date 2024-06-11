package com.pathbreaker.payslip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Allowances")
public class Allowances {

    @Id
    private String allowanceId;

    private Double basicSalary;
    private Double travelAllowance;
    private Double pfContributionEmployee;
    private Double hra;
    private Double specialAllowance;
    private Double totalEarnings;
    private Double otherAllowances;

    @OneToOne(mappedBy = "allowances", cascade = CascadeType.ALL, orphanRemoval = true)
    private Salary salary;
}


