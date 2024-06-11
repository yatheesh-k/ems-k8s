package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.entity.Department;
import com.pathbreaker.payslip.request.DepartmentRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface DepartmentService {
    ResponseEntity<?> createDepartment(DepartmentRequest departmentRequest);

    List<Department> getAllDepartments();

    Optional<Department> getById(int id);

    ResponseEntity<?> updateById(int id, DepartmentRequest departmentRequest);

    ResponseEntity<?> deleteById(int id);
}
