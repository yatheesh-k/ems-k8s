package com.pb.employee.service;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.persistance.model.CompanyEntity;
import com.pb.employee.request.CompanyRequest;
import com.pb.employee.request.CompanyUpdateRequest;
import com.pb.employee.response.CompanyResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CompanyService {
    ResponseEntity<?> registerCompany(CompanyRequest companyRequest) throws EmployeeException;
    ResponseEntity<?> getCompanies() throws EmployeeException;
    ResponseEntity<?> getCompanyById(String companyId) throws EmployeeException;
    ResponseEntity<?> updateCompanyById(String companyId, CompanyUpdateRequest companyUpdateRequest) throws IOException, EmployeeException;
    ResponseEntity<?> deleteCompanyById(String companyId) throws EmployeeException;

}