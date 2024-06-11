package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.SuperAdmin;
import com.pathbreaker.payslip.entity.UserLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {

    SuperAdmin findByEmailId(String emailId);
}
