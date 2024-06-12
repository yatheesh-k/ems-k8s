package com.pbt.ems.repository;

import com.pbt.ems.entity.Employee;
import com.pbt.ems.entity.Salary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SalaryRepository extends JpaRepository<Salary,String> {
    @Query("SELECT MAX(s.salaryId) FROM Salary s")
    String findHighestSalaryId();

    Salary findByEmployee(Employee employee);

    boolean existsByEmployee(Employee employee);
}
