package com.pbt.ems.repository;

import com.pbt.ems.entity.Allowances;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AllowanceRepository extends JpaRepository<Allowances, String> {


    @Query("SELECT MAX(c.allowanceId) FROM Allowances c")
    String findHighestAllowanceId();
}
