package com.pb.employee.serviceImpl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.CompanyEntity;
import com.pb.employee.persistance.model.EmployeeEntity;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.request.CompanyRequest;
import com.pb.employee.request.CompanyUpdateRequest;
import com.pb.employee.request.EmployeeRequest;
import com.pb.employee.response.CompanyResponse;
import com.pb.employee.service.CompanyService;
import com.pb.employee.service.EmployeeService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Override
    public ResponseEntity<?> registerEmployee(EmployeeRequest employeeRequest) throws EmployeeException{
        // Check if a company with the same short or company name already exists
        log.debug("validating name {} employee Id {} exsited ", employeeRequest.getLastName(), employeeRequest.getEmployeeId());
        String resourceId = ResourceIdUtils.generateEmployeeResourceId(employeeRequest.getEmailId());
        Object entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(employeeRequest.getCompanyName());
        try{
            entity = openSearchOperations.getById(resourceId, null, index);
            if(entity != null) {
                log.error("employee details existed{}", employeeRequest.getCompanyName());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_EMAILID_ALREADY_EXISTS), employeeRequest.getEmailId()),
                        HttpStatus.CONFLICT);
            }
        } catch (IOException e) {
            log.error("Unable to get the company details {}", employeeRequest.getCompanyName());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_EMPLOYEE), employeeRequest.getEmailId()),
                    HttpStatus.BAD_REQUEST);
        }

        List<EmployeeEntity> employeeByData = openSearchOperations.getCompanyEmployeeByData(employeeRequest.getCompanyName(), employeeRequest.getEmployeeId(),
                employeeRequest.getEmailId());
        if(employeeByData !=null && employeeByData.size() > 0) {
            log.error("Employee with emailId {} already existed", employeeRequest.getEmployeeId());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_ID_ALREADY_EXISTS), employeeRequest.getEmployeeId()),
                    HttpStatus.CONFLICT);
        }
        try{
            Entity companyEntity = CompanyUtils.maskEmployeeProperties(employeeRequest, resourceId);
            Entity result = openSearchOperations.saveEntity(companyEntity, resourceId, index);
        } catch (Exception exception) {
            log.error("Unable to save the employee details {} {}", employeeRequest.getEmailId(),exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_SAVE_EMPLOYEE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);

    }

    @Override
    public List<CompanyResponse> getCompanies() throws IOException {

        List<CompanyResponse> companyResponses = null;
        return companyResponses;
    }

    @Override
    public CompanyResponse getCompanyById(String companyId){
        return null;
    }

    @Override
    public ResponseEntity<?> updateCompanyById(String companyId, CompanyUpdateRequest companyUpdateRequest, MultipartFile file) throws IOException {
       return null;
    }


    @Override
    public ResponseEntity<?> deleteCompanyById(String companyId) {
       return null;
    }

}
