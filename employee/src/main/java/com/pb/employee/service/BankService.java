package com.pb.employee.service;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.BankRequest;
import com.pb.employee.request.DepartmentRequest;
import com.pb.employee.request.DepartmentUpdateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;

public interface BankService {

    ResponseEntity<?> bankDetailsToCompany(String companyId, BankRequest bankRequest,HttpServletRequest request)throws IOException,EmployeeException;
}