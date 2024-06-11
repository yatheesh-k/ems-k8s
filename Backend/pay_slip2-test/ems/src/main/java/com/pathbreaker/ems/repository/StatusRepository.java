package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatusRepository extends JpaRepository<Status, Integer> {


    Optional<Status> findByStatusInfoIgnoreCase(String statusInfo);
}
