package com.pathbreaker.payslip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Deductions")
public class Deductions {

    @Id
    private String deductionId;

    private Double pfEmployee;
    private Double pfEmployer;
    private Double lop;
    private Double totalDeductions;
    private Double pfTax;
    private Double incomeTax;
    private Double totalTax;
    private Double netSalary;

    @OneToOne(mappedBy = "deductions", cascade = CascadeType.ALL, orphanRemoval = true)
    private Salary salary;
}


