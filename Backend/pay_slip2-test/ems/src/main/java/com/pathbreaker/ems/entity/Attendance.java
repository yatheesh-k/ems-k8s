package com.pathbreaker.payslip.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Attendance")
public class Attendance {

    @Id
    private String attendanceId;

    private String month;
    private Long year;
    private Long totalWorkingDays;
    private Long lop;

    @ManyToOne
    @JoinColumn(name = "employeeId")
    private Employee employee;


}


