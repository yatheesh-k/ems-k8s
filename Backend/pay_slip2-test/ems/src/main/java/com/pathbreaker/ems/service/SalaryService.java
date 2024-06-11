package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.request.PaySlipsRequest;
import com.pathbreaker.payslip.request.SalaryRequest;
import com.pathbreaker.payslip.response.SalaryResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SalaryService {
    ResponseEntity<?> addSalary(String employeeId,SalaryRequest salaryRequest);

    List<SalaryResponse> getAllSalaries();

    SalaryResponse getSalariesByEmpId(String employeeId);

    ResponseEntity<?> updateBySalaryId(String salaryId, SalaryRequest salaryRequest);
}
