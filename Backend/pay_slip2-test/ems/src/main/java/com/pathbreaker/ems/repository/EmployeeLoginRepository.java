package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.EmployeeLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeLoginRepository extends JpaRepository<EmployeeLogin, Integer> {

}
