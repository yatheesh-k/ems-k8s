package com.pbt.ems.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "SuperAdmin")
public class SuperAdmin {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   private String emailId;
   private String password;
   private String name;

    @Column(columnDefinition = "TIMESTAMP")
    private Date lastLoginTime;

    private LocalDateTime expiryTime;


}


