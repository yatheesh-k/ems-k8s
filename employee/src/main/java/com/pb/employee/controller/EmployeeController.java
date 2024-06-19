package com.pb.employee.controller;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.CompanyRequest;
import com.pb.employee.request.CompanyUpdateRequest;
import com.pb.employee.request.EmployeeRequest;
import com.pb.employee.response.CompanyResponse;
import com.pb.employee.service.EmployeeService;
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
@RequestMapping("/employee")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;
    @RequestMapping(value = "", method = RequestMethod.POST,consumes = MediaType.APPLICATION_JSON_VALUE)
    @io.swagger.v3.oas.annotations.Operation(security = { @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = Constants.AUTH_KEY) },
            summary = "${api.registerEmployee.tag}", description = "${api.registerEmployee.description}")
    @ResponseStatus(HttpStatus.CREATED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description= "CREATED")
    public ResponseEntity<?> registerEmployee(@Parameter(hidden = true, required = true, description = "${apiAuthToken.description}", example = "Bearer abcdef12-1234-1234-1234-abcdefabcdef")
                                             @RequestHeader(Constants.AUTH_KEY) String authToken,
                                             @Parameter(required = true, description = "${api.registerEmployeePayload.description}")
                                             @RequestBody @Valid EmployeeRequest employeeRequest) throws EmployeeException {
        return employeeService.registerEmployee(employeeRequest);
    }

    @GetMapping("/all")
    public List<CompanyResponse> getEmployee() throws IOException {
        return employeeService.getCompanies();
    }

    @GetMapping("/{employeeId}")
    public CompanyResponse getCompanyById(@PathVariable String emailId) throws IOException {
        return employeeService.getCompanyById(emailId);
    }

    @PutMapping("/{companyId}")
    public ResponseEntity<?> updateCompanyById(@PathVariable String companyId,
                                               @ModelAttribute CompanyUpdateRequest companyUpdateRequest,
                                               @RequestPart("file") MultipartFile multipartFile)throws IOException{
        return employeeService.updateCompanyById(companyId,companyUpdateRequest,multipartFile);
    }
    @DeleteMapping("/{companyId}")
    public ResponseEntity<?> deleteCompanyById(@PathVariable String companyId){
        return employeeService.deleteCompanyById(companyId);
    }
}
