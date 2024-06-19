package com.pb.employee.service;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.CompanyRequest;
import com.pb.employee.request.CompanyUpdateRequest;
import com.pb.employee.request.EmployeeRequest;
import com.pb.employee.response.CompanyResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface EmployeeService {
    ResponseEntity<?> registerEmployee(EmployeeRequest employeeRequest) throws EmployeeException;
    List<CompanyResponse> getCompanies() throws IOException;
    CompanyResponse getCompanyById(String companyId);
    ResponseEntity<?> updateCompanyById(String companyId, CompanyUpdateRequest companyUpdateRequest,MultipartFile multipartFile)throws IOException;
    ResponseEntity<?> deleteCompanyById(String companyId);

}