package com.pbt.ems.service;


import com.pbt.ems.request.CompanyRequest;
import com.pbt.ems.request.CompanyUpdateRequest;
import com.pbt.ems.response.CompanyResponse;
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