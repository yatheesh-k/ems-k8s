package com.pbt.ems.repository;

import com.pbt.ems.entity.CompanyLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyLoginRepository extends JpaRepository<CompanyLogin, Long> {


}
