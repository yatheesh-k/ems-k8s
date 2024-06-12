package com.pbt.ems.repository;

import com.pbt.ems.entity.PayRoll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayRollRepository extends JpaRepository<PayRoll, String> {

    @Query("SELECT MAX(c.payRollId) FROM PayRoll c")
    String findHighestPayrollId();

    List<PayRoll> findByEmployeeEmployeeId(String employeeId);
}
