package com.pathbreaker.payslip.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "Company")
public class Company {

    @Id
    @Column(length = 20)
    private String companyId;

    @Column(length = 30)
    private String companyName;

    @Column(length = 30)
    private String emailId;

    @Column(length = 20)
    private String password;

    @Column(length = 200)
    private String companyAddress;

    @Column(length = 30)
    private String companyRegNo;

    @Column(length = 20)
    private String mobileNo;

    @Column(length = 20)
    private String landNo;

    @Column(length = 30)
    private String gstNo;

    @Column(length = 20)
    private String panNo;

    @Column(length = 30)
    private String name;

    @Column(length = 30)
    private String personalMailId;

    @Column(length = 30)
    private String personalMobileNo;

    @Column(length = 200)
    private String address;

    @Column(length = 100)
    private String imageFile;

    @Column(length = 30)
    private String companyType;

    @Column(length = 30)
    private String companyBranch;

    @Column(length = 30)
    private String cinNo;

    @Column(length = 30)
    private Long pfPercentage;

    @Column(length = 30)
    private Long travelAllowance;

    @Column(length = 30)
    private Long specialAllowance;

    @Column(length = 30)
    private Long hraPercentage;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Employee> employee;

    @OneToOne(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private CompanyLogin companyLogin;



}
