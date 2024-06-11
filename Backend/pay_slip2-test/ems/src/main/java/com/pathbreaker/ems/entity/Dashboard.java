package com.pathbreaker.payslip.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Dashboard")
public class Dashboard {

        @Id
        private long id;

        private Long employeesCount;
        private LocalDate employeesUpdatedDate;
        private Long currentCount;
        private Long relievingCount;
        private LocalDate updatedDate;

}
