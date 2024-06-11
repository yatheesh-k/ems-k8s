package com.pathbreaker.payslip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "Employee")
public class Employee {

    @Id
    private String employeeId;
    private String employeeType;
    private String firstName;
    private String lastName;
    private String emailId;
    private String password;
    private String designation;
    @Column(columnDefinition = "TIMESTAMP")
    private Date dateOfHiring;
    private String department;
    private String location;
    private String manager;
    private String role;
    private int status;
    private String panNo;
    private String uanNo;
    private String dateOfBirth;
    private String accountNo;
    private String ifscCode;
    private String bankName;

    @OneToOne(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private EmployeeLogin employeeLogin;

    @ManyToOne
    @JoinColumn(name = "companyId",nullable = false)
    private Company company;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Salary> salary;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendance> attendance;

}
