package com.pb.employee.service;

import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.PayslipRequest;
import com.pb.employee.request.SalaryRequest;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface PayslipService {

    ResponseEntity<?> addPaySlip(PayslipRequest payslipRequest, String salaryId, String employeeId) throws EmployeeException, IOException;

    ResponseEntity<?> getPayslipById(String companyName, String employeeId ,String payslipId) throws EmployeeException, IOException;
    ResponseEntity<?> getEmployeePayslips(String companyName, String employeeId) throws EmployeeException;

    ResponseEntity<?> deleteEmployeePayslipById(String companyName, String employeeId,String payslipId) throws EmployeeException;

}
