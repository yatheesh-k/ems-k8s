package com.pb.employee.serviceImpl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.EmployeeRequest;
import com.pb.employee.request.EmployeeUpdateRequest;
import com.pb.employee.service.EmployeeService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.EmployeeUtils;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
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
            List<CompanyEntity> shortNameEntity = openSearchOperations.getCompanyByData(null, Constants.COMPANY, employeeRequest.getCompanyName());

            Entity companyEntity = EmployeeUtils.maskEmployeeProperties(employeeRequest, resourceId, shortNameEntity.getFirst().getId());
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
    public ResponseEntity<?> getEmployees(String companyName) throws EmployeeException, IOException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        List<EmployeeEntity> employeeEntities = null;

        try {
            employeeEntities = openSearchOperations.getCompanyEmployees(companyName);
            for (EmployeeEntity employee :employeeEntities){
                DepartmentEntity entity =null;
                DesignationEntity designationEntity = null;
                if (employee.getDepartment() !=null && employee.getDesignation() !=null) {
                    entity = openSearchOperations.getDepartmentById(employee.getDepartment(), null, index);
                    designationEntity = openSearchOperations.getDesignationById(employee.getDesignation(), null, index);
                }
                EmployeeUtils.unmaskEmployeeProperties(employee, entity, designationEntity );
            }
        } catch (Exception ex) {
            log.error("Exception while fetching employees for company {}: {}", companyName, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(employeeEntities), HttpStatus.OK);
    }




    @Override
    public ResponseEntity<?> getEmployeeById(String companyName, String employeeId) throws EmployeeException {
        log.info("getting details of {}", employeeId);
        EmployeeEntity entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        try {
            entity = openSearchOperations.getEmployeeById(employeeId, null, index);
            DepartmentEntity departmentEntity =null;
            DesignationEntity designationEntity = null;
            if (entity.getDepartment() !=null && entity.getDesignation() !=null) {
                departmentEntity = openSearchOperations.getDepartmentById(entity.getDepartment(), null, index);
                designationEntity = openSearchOperations.getDesignationById(entity.getDesignation(), null, index);
                EmployeeUtils.unmaskEmployeeProperties(entity, departmentEntity, designationEntity);

            }
        } catch (Exception ex) {
            log.error("Exception while fetching company details {}", ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(entity), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateEmployeeById(String employeeId, EmployeeUpdateRequest employeeUpdateRequest) throws IOException, EmployeeException {
        log.info("getting details of {}", employeeId);
        EmployeeEntity user;
        String index = ResourceIdUtils.generateCompanyIndex(employeeUpdateRequest.getCompanyName());
        try {
            user = openSearchOperations.getEmployeeById(employeeId, null, index);

            if (user == null) {
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_COMPANY),
                        HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {

            log.error("Exception while fetching company details {}", ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Entity entity = CompanyUtils.maskEmployeeUpdateProperties(user, employeeUpdateRequest);
        openSearchOperations.saveEntity(entity, employeeId, index);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.OK);
    }


    @Override
    public ResponseEntity<?> deleteEmployeeById(String companyName,String employeeId) throws EmployeeException {
        log.info("getting details of {}", employeeId);
        Object entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        try {
            entity = openSearchOperations.getById(employeeId, null, index);

            if (entity!=null) {
                openSearchOperations.deleteEntity(employeeId,index);
            }
        } catch (Exception ex) {
            log.error("Exception while fetching company details {}", ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_DELETE_EMPLOYEE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }


        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.DELETED), HttpStatus.OK);

    }

}