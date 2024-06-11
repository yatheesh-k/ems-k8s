package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Employee;
import com.pathbreaker.payslip.entity.Relieving;
import com.pathbreaker.payslip.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SalaryRepository extends JpaRepository<Salary,String> {
    @Query("SELECT MAX(s.salaryId) FROM Salary s")
    String findHighestSalaryId();

    Salary findByEmployee(Employee employee);

    boolean existsByEmployee(Employee employee);
}
