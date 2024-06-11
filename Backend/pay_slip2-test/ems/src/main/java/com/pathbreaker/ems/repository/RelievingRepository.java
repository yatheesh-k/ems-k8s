package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Relieving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RelievingRepository extends JpaRepository<Relieving,Integer> {
    Optional<Relieving> findByEmployeeId(String employeeId);
}
