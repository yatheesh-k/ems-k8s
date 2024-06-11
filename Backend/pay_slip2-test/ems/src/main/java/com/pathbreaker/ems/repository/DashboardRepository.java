package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Dashboard;
import com.pathbreaker.payslip.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DashboardRepository extends JpaRepository<Dashboard,Long> {
}
