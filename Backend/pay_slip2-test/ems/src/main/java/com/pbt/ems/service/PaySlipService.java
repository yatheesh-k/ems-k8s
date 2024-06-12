package com.pbt.ems.service;

import com.pbt.ems.request.PaySlipsRequest;
import com.pbt.ems.response.EmployeeSalaryResponse;
import com.pbt.ems.response.PaySlipsResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

public interface PaySlipService {

    List<PaySlipsResponse> getPayslipByCompanyId(String companyId);

    List<PaySlipsResponse> getByEmployeeId(String employeeId);

    ResponseEntity<?> generatePayslip(String companyId, String employeeId , PaySlipsRequest paySlipsRequest)throws IOException;

    ResponseEntity<byte[]> getPayslipById(Long payslipId,HttpServletRequest request) throws  IOException;

    ResponseEntity<byte[]> ViewPayslipById(Long payslipId);

    ResponseEntity<List<EmployeeSalaryResponse>> getByEmployeeDetails(String companyId, PaySlipsRequest paySlipsRequest)throws IOException;
}
