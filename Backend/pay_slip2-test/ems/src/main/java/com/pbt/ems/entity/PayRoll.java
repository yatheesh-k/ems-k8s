package com.pbt.ems.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "payroll")
public class PayRoll {

    @Id
    private String payRollId;


    private String month;


    private Long year;

    private double incrementAmount;
    private String incrementPurpose;

    @ManyToOne
    @JoinColumn(name = "employeeId")
    private Employee employee;


}
