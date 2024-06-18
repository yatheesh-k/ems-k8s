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
import com.pb.employee.response.CompanyResponse;
import com.pb.employee.service.CompanyService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class CompanyServiceImpl implements CompanyService {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Override
    public ResponseEntity<?> registerCompany(CompanyRequest companyRequest) throws EmployeeException{
        // Check if a company with the same short or company name already exists
        log.debug("validating shortname {} company name {} exsited ", companyRequest.getShortName(), companyRequest.getCompanyName());
        String resourceId = ResourceIdUtils.generateCompanyResourceId(companyRequest.getCompanyName());
        Object entity = null;
        try{
            entity = openSearchOperations.getById(resourceId, null, Constants.INDEX_EMS);
            if(entity != null) {
                log.error("Company details existed{}", companyRequest.getCompanyName());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.COMPANY_ALREADY_EXISTS), companyRequest.getCompanyName()),
                        HttpStatus.CONFLICT);
            }
        } catch (IOException e) {
            log.error("Unable to get the company details {}", companyRequest.getCompanyName());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_COMPANY), companyRequest.getCompanyName()),
                    HttpStatus.BAD_REQUEST);
        }

        if(entity != null) {
            log.error("Company with name {} already existed", companyRequest.getCompanyName());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.COMPANY_ALREADY_EXISTS), companyRequest.getCompanyName()),
                    HttpStatus.CONFLICT);
        }
        List<CompanyEntity> shortNameEntity = openSearchOperations.getCompanyByData(null, Constants.COMPANY, companyRequest.getShortName());
        if(shortNameEntity !=null && shortNameEntity.size() > 0) {
            log.error("Company with shortname {} already existed", companyRequest.getCompanyName());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.COMPANY_SHORT_NAME_ALREADY_EXISTS), companyRequest.getShortName()),
                    HttpStatus.CONFLICT);
        }
        try{
            Entity companyEntity = CompanyUtils.maskCompanyProperties(companyRequest, resourceId);
            Entity result = openSearchOperations.saveEntity(companyEntity, resourceId, Constants.INDEX_EMS);
        } catch (Exception exception) {
            log.error("Unable to save the company details {} {}", companyRequest.getCompanyName(),exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_SAVE_COMPANY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        openSearchOperations.createIndex(companyRequest.getShortName());
        String password = Base64.getEncoder().encodeToString(companyRequest.getPassword().getBytes());
        log.info("Creating the employee of company admin");
        String index = ResourceIdUtils.generateCompanyIndex(companyRequest.getShortName());
        String employeeAdminId = ResourceIdUtils.generateEmployeeResourceId(companyRequest.getEmailId());
        EmployeeEntity employee = EmployeeEntity.builder().
                employeeType(Constants.EMPLOYEE_TYPE).
                emailId(companyRequest.getEmailId()).
                password(password).
                type(Constants.EMPLOYEE).
                build();
        openSearchOperations.saveEntity(employee, employeeAdminId, index);
        // Map the request to an entity
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
