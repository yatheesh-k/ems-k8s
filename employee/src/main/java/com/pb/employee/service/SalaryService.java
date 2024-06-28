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

    ResponseEntity<?> getEmployeeSalaryById(String companyName, String employeeId,String salaryId)throws EmployeeException;

    ResponseEntity<?> updateEmployeeSalaryById(String companyName, String employeeId, String companyId,EmployeeUpdateRequest employeeUpdateRequest);

    ResponseEntity<?> deleteEmployeeSalaryById(String companyName,String employeeId,String salaryId)throws EmployeeException ;
}