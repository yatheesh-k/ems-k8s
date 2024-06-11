package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.request.PayRollRequest;
import com.pathbreaker.payslip.response.PayRollResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PayRollService {

    ResponseEntity<?> createPayroll(PayRollRequest payRollRequest, String employeeId);
    List<PayRollResponse> getAllPayrolls();
    List<PayRollResponse> getPayrollByEmployeeId(String employeeId);
    ResponseEntity<?> updatePayrollById(String payrollId, PayRollRequest payRollRequest);
    ResponseEntity<?> deletePayrollById(String payrollId);
}
