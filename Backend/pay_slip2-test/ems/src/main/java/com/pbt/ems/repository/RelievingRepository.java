package com.pbt.ems.repository;

import com.pbt.ems.entity.Relieving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RelievingRepository extends JpaRepository<Relieving,Integer> {
    Optional<Relieving> findByEmployeeId(String employeeId);
}
