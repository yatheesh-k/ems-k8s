package com.pbt.ems.service;

import com.pbt.ems.request.PayRollRequest;
import com.pbt.ems.response.PayRollResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PayRollService {

    ResponseEntity<?> createPayroll(PayRollRequest payRollRequest, String employeeId);
    List<PayRollResponse> getAllPayrolls();
    List<PayRollResponse> getPayrollByEmployeeId(String employeeId);
    ResponseEntity<?> updatePayrollById(String payrollId, PayRollRequest payRollRequest);
    ResponseEntity<?> deletePayrollById(String payrollId);
}
