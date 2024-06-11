package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Company;
import com.pathbreaker.payslip.entity.CompanyLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyLoginRepository extends JpaRepository<CompanyLogin, Long> {


}
