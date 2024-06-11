package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Company;
import com.pathbreaker.payslip.entity.Deductions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DeductionRepository extends JpaRepository<Deductions, String> {


    @Query("SELECT MAX(c.deductionId) FROM Deductions c")
    String findHighestDeductionId();
}
