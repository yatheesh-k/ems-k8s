package com.pbt.ems.service;

import com.pbt.ems.request.SalaryRequest;
import com.pbt.ems.response.SalaryResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SalaryService {
    ResponseEntity<?> addSalary(String employeeId, SalaryRequest salaryRequest);

    List<SalaryResponse> getAllSalaries();

    SalaryResponse getSalariesByEmpId(String employeeId);

    ResponseEntity<?> updateBySalaryId(String salaryId, SalaryRequest salaryRequest);
}
