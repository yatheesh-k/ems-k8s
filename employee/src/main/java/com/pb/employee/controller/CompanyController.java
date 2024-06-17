package com.pb.employee.controller;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.CompanyRequest;
import com.pb.employee.request.CompanyUpdateRequest;
import com.pb.employee.response.CompanyResponse;
import com.pb.employee.service.CompanyService;
import com.pb.employee.util.Constants;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @RequestMapping(value = "/", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
    @io.swagger.v3.oas.annotations.Operation(security = { @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = Constants.AUTH_KEY) },
            summary = "${api.registerCompany.tag}", description = "${api.registerCompany.description}")
    @ResponseStatus(HttpStatus.CREATED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description= "CREATED")
    public ResponseEntity<?> registerCompany(@Parameter(hidden = true, required = true, description = "${apiAuthToken.description}", example = "Bearer abcdef12-1234-1234-1234-abcdefabcdef")
                                             @RequestHeader(Constants.AUTH_KEY) String authToken,
                                             @Parameter(required = true, description = "${api.registerCompanyPayload.description}")
                                             @RequestBody @Valid CompanyRequest companyRequest) throws EmployeeException {
        return companyService.registerCompany(companyRequest);
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
