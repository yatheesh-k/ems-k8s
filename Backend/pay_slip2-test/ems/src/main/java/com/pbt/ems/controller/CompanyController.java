package com.pbt.ems.controller;


import com.pbt.ems.request.CompanyRequest;
import com.pbt.ems.request.CompanyUpdateRequest;
import com.pbt.ems.response.CompanyResponse;
import com.pbt.ems.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/company")
public class CompanyController {
    @Autowired
    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }
    private final CompanyService companyService;
    @RequestMapping(value = "/add", method = RequestMethod.POST,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerCompany(@ModelAttribute CompanyRequest companyRequest, @RequestPart("file") MultipartFile multipartFile){
        return companyService.registerCompany(companyRequest, multipartFile);
   }

   @GetMapping("/all")
    public List<CompanyResponse> getCompany() throws IOException {
        return companyService.getCompanies();
   }

    @GetMapping("/{companyId}")
    public CompanyResponse getCompanyById(@PathVariable String companyId) throws IOException {
        return companyService.getCompanyById(companyId);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateCompanyById(@PathVariable String companyId,
                                               @ModelAttribute CompanyUpdateRequest companyUpdateRequest,
                                               @RequestPart("file") MultipartFile multipartFile)throws IOException{
        return companyService.updateCompanyById(companyId,companyUpdateRequest,multipartFile);
    }
    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteCompanyById(@PathVariable String companyId){
        return companyService.deleteCompanyById(companyId);
    }
}
