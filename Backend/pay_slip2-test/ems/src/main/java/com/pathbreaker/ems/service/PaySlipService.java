package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.entity.PaySlip;
import com.pathbreaker.payslip.request.PaySlipUpdateRequest;
import com.pathbreaker.payslip.request.PaySlipsRequest;
import com.pathbreaker.payslip.response.EmployeeResponse;
import com.pathbreaker.payslip.response.EmployeeSalaryResponse;
import com.pathbreaker.payslip.response.PaySlipsResponse;
import com.pathbreaker.payslip.response.SalaryResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PaySlipService {

    List<PaySlipsResponse> getPayslipByCompanyId(String companyId);

    List<PaySlipsResponse> getByEmployeeId(String employeeId);

    ResponseEntity<?> generatePayslip(String companyId, String employeeId ,PaySlipsRequest paySlipsRequest)throws IOException;

    ResponseEntity<byte[]> getPayslipById(Long payslipId,HttpServletRequest request) throws  IOException;

    ResponseEntity<byte[]> ViewPayslipById(Long payslipId);

    ResponseEntity<List<EmployeeSalaryResponse>> getByEmployeeDetails(String companyId, PaySlipsRequest paySlipsRequest)throws IOException;
}
