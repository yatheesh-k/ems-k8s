package com.pbt.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;


@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "EmployeeLogin")
public class EmployeeLogin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @Column(columnDefinition = "TIMESTAMP")
    private Date lastLoginTime;

    private LocalDateTime expiryTime;

    @OneToOne
    @JoinColumn(name = "employeeId")
    private Employee employee;

}
