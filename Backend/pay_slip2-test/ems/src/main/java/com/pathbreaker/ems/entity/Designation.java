package com.pathbreaker.payslip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Designation")
public class Designation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String designationTitle;

}
