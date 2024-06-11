package com.pathbreaker.payslip.request;

import com.pathbreaker.payslip.entity.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class AttendanceRequest {

    private String month;
    private Long year;
    private Long totalWorkingDays;
    private Long lop;

}


