package com.pb.employee.serviceImpl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.common.ResponseObject;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.EmployeeEntity;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.persistance.model.SalaryEntity;
import com.pb.employee.request.EmployeeStatus;
import com.pb.employee.request.SalaryRequest;
import com.pb.employee.service.SalaryService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.EmployeeUtils;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
@Slf4j
public class SalaryServiceImpl implements SalaryService {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private OpenSearchOperations openSearchOperations;
    @Autowired
    private EmployeeServiceImpl employeeService;

    @Override
    public ResponseEntity<?> addSalary(SalaryRequest salaryRequest,String employeeId) throws EmployeeException{
        LocalDateTime currentDateTime = LocalDateTime.now();
        String timestamp = currentDateTime.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String salaryId = ResourceIdUtils.generateSalaryResourceId(employeeId, timestamp);
        EmployeeEntity entity = null;
        List<SalaryEntity> salary = null;
        String index = ResourceIdUtils.generateCompanyIndex(salaryRequest.getCompanyName());
        try{
                entity = openSearchOperations.getEmployeeById(employeeId, null, index);
            if (entity!=null) {
                salary = openSearchOperations.getSalaries(salaryRequest.getCompanyName(), employeeId);
                if (salary != null){
                    for (SalaryEntity salaryEntity : salary) {
                        String gross = new String(Base64.getDecoder().decode(salaryEntity.getGrossAmount()));
                        if (gross.equals(salaryRequest.getGrossAmount())) {
                            return new ResponseEntity<>(
                                    ResponseBuilder.builder().build().createFailureResponse(new Exception(String.valueOf(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.SALARY_ALREADY_EXIST)))),
                                    HttpStatus.CONFLICT);
                        }
                        salaryEntity.setStatus(EmployeeStatus.INACTIVE.getStatus());
                        openSearchOperations.saveEntity(salaryEntity, salaryEntity.getSalaryId(), index);

                    }
                }
                Entity salaryEntity = CompanyUtils.maskEmployeeSalaryProperties(salaryRequest, salaryId,employeeId);
                Entity result = openSearchOperations.saveEntity(salaryEntity, salaryId, index);
            } else {
                log.error("employee not found");
                 throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_EMPLOYEE),
                        HttpStatus.NOT_FOUND);
            }
        }  catch (EmployeeException exception) {
            if(exception.getHttpStatus().equals(HttpStatus.NOT_FOUND)){
                log.error("Unable to find the employee details {}", exception.getMessage());
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_EMPLOYEE),
                        HttpStatus.NOT_FOUND);
            }
            log.error("Unable to save the employee salary details {}", exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_SAVE_SALARY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }  catch (IOException exception) {
            log.error("Unable to save the employee salary details {}", exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_SAVE_SALARY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);
    }
    @Override
    public ResponseEntity<?> getEmployeeSalaryById(String companyName, String employeeId,String salaryId) throws EmployeeException, IOException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        EmployeeEntity employee = openSearchOperations.getEmployeeById(employeeId, null, index);
        if (employee==null){
            log.error("Exception while fetching employee for salary {}", employeeId);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        SalaryEntity entity = null;
        try {

            entity = openSearchOperations.getSalaryById(salaryId, null, index);
            if (entity == null || !(entity instanceof SalaryEntity)) {
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!entity.getEmployeeId().equals(employeeId)) {
                log.error("Employee ID mismatch for salary {}: expected {}, found {}", salaryId, employeeId, entity.getEmployeeId());
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            entity= EmployeeUtils.unMaskEmployeeSalaryProperties(entity);


        }
        catch (Exception ex) {
            log.error("Exception while fetching salaries for employees {}: {}", employeeId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(entity), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> getEmployeeSalary(String companyName,String employeeId) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        List<SalaryEntity> salaryEntities = null;
        Object entity = null;
        List<SalaryEntity> salaryEntityList;
        try {
            salaryEntities = openSearchOperations.getSalaries(companyName, employeeId);
            salaryEntityList = new ArrayList<>();
            for (SalaryEntity salaryEntity : salaryEntities) {
                SalaryEntity salary = EmployeeUtils.unMaskEmployeeSalaryProperties(salaryEntity);
                salaryEntityList.add(salary);
                entity = openSearchOperations.getById(salary.getEmployeeId(), null, index);
                if (entity == null){
                    log.error("Employee ID mismatch for salary {}: expected {}, found {}", salary.getSalaryId(), employeeId, salary.getEmployeeId());
                    throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                            HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }


        } catch (Exception ex) {
            log.error("Exception while fetching salaries for employees {}: {}", employeeId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(salaryEntityList), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteEmployeeSalaryById(String companyName, String employeeId,String salaryId) throws EmployeeException{
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        SalaryEntity entity = null;
        try {
            entity = openSearchOperations.getSalaryById(salaryId, null, index);
            if (entity==null){
                log.error("Exception while fetching employee for salary {}", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!entity.getEmployeeId().equals(employeeId)) {
                log.error("Employee ID mismatch for salary {}: expected {}, found", salaryId, employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            openSearchOperations.deleteEntity(salaryId, index);
        }
        catch (Exception ex) {
            log.error("Exception while deleting salaries for employees {}: {}", salaryId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.DELETED), HttpStatus.OK);

    }

    public ResponseEntity<?> updateEmployeeSalaryById(String employeeId, SalaryRequest salaryUpdateRequest, String salaryId) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(salaryUpdateRequest.getCompanyName());
        EmployeeEntity employee = null;
        SalaryEntity entity = null;
        try {
            entity = openSearchOperations.getSalaryById(salaryId, null, index);
            if (entity==null){
                log.error("Exception while fetching employee for salary {}", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!entity.getEmployeeId().equals(employeeId)) {
                log.error("Employee ID mismatch for salary {}: expected {}, found", salaryId, employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception ex) {
            log.error("Exception while fetching user {}:", employeeId, ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Entity employeeSalaryProperties = CompanyUtils.maskUpdateSalary(salaryUpdateRequest, entity);
        openSearchOperations.saveEntity(employeeSalaryProperties, salaryId, index);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.OK);
    }



}