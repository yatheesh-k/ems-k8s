package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Company;
import com.pathbreaker.payslip.entity.Employee;
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
