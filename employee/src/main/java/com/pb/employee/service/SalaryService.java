package com.pb.employee.service;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.EmployeeRequest;
import com.pb.employee.request.EmployeeUpdateRequest;
import com.pb.employee.request.SalaryRequest;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface SalaryService {


    ResponseEntity<?> addSalary(SalaryRequest salaryRequest,String employeeId)throws EmployeeException;

    ResponseEntity<?> getEmployeeSalary(String companyName,String employeeId) throws EmployeeException;

    ResponseEntity<?> getEmployeeSalaryById(String companyName, String employeeId,String salaryId) throws EmployeeException, IOException;

    ResponseEntity<?> updateEmployeeSalaryById(String employeeId, SalaryRequest salaryRequest, String salaryId) throws EmployeeException;

    public ResponseEntity<?> deleteEmployeeSalaryById(String companyNae,String employeeId, String salaryId) throws EmployeeException;
}