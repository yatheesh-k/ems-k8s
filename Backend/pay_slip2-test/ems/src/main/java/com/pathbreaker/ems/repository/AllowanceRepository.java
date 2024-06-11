package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Allowances;
import com.pathbreaker.payslip.entity.Deductions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AllowanceRepository extends JpaRepository<Allowances, String> {


    @Query("SELECT MAX(c.allowanceId) FROM Allowances c")
    String findHighestAllowanceId();
}
