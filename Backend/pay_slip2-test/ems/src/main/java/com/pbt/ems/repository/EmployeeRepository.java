package com.pbt.ems.repository;

import com.pbt.ems.entity.Company;
import com.pbt.ems.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmployeeId(String employeeId);

    boolean existsByFirstNameAndLastName(String firstName, String lastName);

    boolean existsByEmailId(String emailId);

    Optional<Employee> findByEmployeeIdAndCompany(String employeeId, Company companyId);

    List<Employee> findByCompany(Company companyId);

    Employee findByEmailId(String emailId);
}
