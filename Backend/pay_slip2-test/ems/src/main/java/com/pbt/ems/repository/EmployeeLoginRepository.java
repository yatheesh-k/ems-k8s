package com.pbt.ems.repository;

import com.pbt.ems.entity.EmployeeLogin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeLoginRepository extends JpaRepository<EmployeeLogin, Integer> {

}
