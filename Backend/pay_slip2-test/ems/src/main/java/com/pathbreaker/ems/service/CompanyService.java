package com.pathbreaker.payslip.service;


import com.pathbreaker.payslip.request.CompanyRequest;
import com.pathbreaker.payslip.request.CompanyUpdateRequest;
import com.pathbreaker.payslip.response.CompanyResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CompanyService {
    ResponseEntity<?> registerCompany(CompanyRequest companyRequest, MultipartFile multipartFile);
    List<CompanyResponse> getCompanies() throws IOException;
    CompanyResponse getCompanyById(String companyId);
    ResponseEntity<?> updateCompanyById(String companyId, CompanyUpdateRequest companyUpdateRequest,MultipartFile multipartFile)throws IOException;
    ResponseEntity<?> deleteCompanyById(String companyId);

}