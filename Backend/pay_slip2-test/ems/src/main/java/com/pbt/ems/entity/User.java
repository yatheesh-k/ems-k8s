package com.pbt.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "User")
public class User {

    @Id
    private String userId;

    private String emailId;

    private String userName;

    private String password;

    private String role;

    private int status;

    private Date registrationDate;

    @OneToOne(mappedBy = "userEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private UserLogin userLoginEntity;

    @ManyToOne
    @JoinColumn(name = "companyId")
    private Company company;
}
