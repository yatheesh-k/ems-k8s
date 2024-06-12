package com.pbt.ems.repository;

import com.pbt.ems.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {


    @Query("SELECT MAX(c.companyId) FROM Company c")
    String findHighestCompanyId();

    boolean existsByEmailId(String emailId);

    boolean existsByCompanyName(String companyName);

    Company findByEmailId(String emailId);
}
