package com.pbt.ems.service;

import com.pbt.ems.request.EmployeeRequest;
import com.pbt.ems.request.EmployeeUpdateRequest;
import com.pbt.ems.response.EmployeeResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EmployeeService {
    ResponseEntity<?> createEmployee(String companyId, EmployeeRequest employeeRequest);

    List<EmployeeResponse> getAllEmployees();

    EmployeeResponse getEmployeeById(String employeeId);

    ResponseEntity<?> updateEmployeeById(String employeeId, EmployeeUpdateRequest employeeUpdateRequest);

    ResponseEntity<?> deleteEmployeeById(String employeeId);
}
