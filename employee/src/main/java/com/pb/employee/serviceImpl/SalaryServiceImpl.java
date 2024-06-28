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
import com.pb.employee.persistance.model.SalaryEntity;
import com.pb.employee.request.CompanyRequest;
import com.pb.employee.request.CompanyUpdateRequest;
import com.pb.employee.request.EmployeeUpdateRequest;
import com.pb.employee.request.SalaryRequest;
import com.pb.employee.service.CompanyService;
import com.pb.employee.service.SalaryService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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
        String salaryId = ResourceIdUtils.generateSalaryResourceId(employeeId);
        ResponseEntity<?> entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(salaryRequest.getCompanyName());
        try{
            entity = employeeService.getEmployeeById(salaryRequest.getCompanyName(), employeeId);
            if (entity!=null) {
                Entity salaryEntity = CompanyUtils.maskEmployeeSalaryProperties(salaryRequest, salaryId,employeeId);
                Entity result = openSearchOperations.saveEntity(salaryEntity, salaryId, index);
            }
        }  catch (Exception exception) {
            log.error("Unable to save the employee salary details {} {}", salaryRequest.getType(),exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_SAVE_SALARY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<?> getEmployeeSalary(String companyName,String employeeId) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        List<SalaryEntity> salaryEntities = null;
        try {
            salaryEntities = openSearchOperations.getSalaries(companyName);
        }
        catch (Exception ex) {
            log.error("Exception while fetching salaries for employees {}: {}", employeeId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(salaryEntities), HttpStatus.OK);
    }
    @Override
    public ResponseEntity<?> getEmployeeSalaryById(String companyName, String employeeId,String salaryId) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        List<SalaryEntity> salaryEntities = null;
        Object entity = null;
        try {

            entity = openSearchOperations.getById(salaryId, null, index);
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
    public ResponseEntity<?> updateEmployeeSalaryById(String companyName, String employeeId,String salaryId,EmployeeUpdateRequest employeeUpdateRequest) {
        return null;
    }

    @Override
    public ResponseEntity<?> deleteEmployeeSalaryById(String companyName, String employeeId,String salaryId) throws EmployeeException{
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        List<SalaryEntity> salaryEntities = null;
        Object entity = null;
        try {
            String salaryResourceId = ResourceIdUtils.generateSalaryResourceId(employeeId);
            entity = openSearchOperations.deleteEntity(salaryResourceId, index);
        }
        catch (Exception ex) {
            log.error("Exception while deleting salaries for employees {}: {}", salaryId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(entity), HttpStatus.OK);

    }






    /*@Override
    public ResponseEntity<?> updateCompanyById(String companyId,  CompanyUpdateRequest companyUpdateRequest) throws EmployeeException, IOException {
        CompanyEntity user;
        try {
            user = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
            if (user == null) {
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_COMPANY),
                        HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            log.error("Exception while fetching user {}, {}", companyId, ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_COMPANY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Entity entity = CompanyUtils.maskCompanyUpdateProperties(user, companyUpdateRequest, companyId);
        openSearchOperations .saveEntity(entity, companyId, Constants.INDEX_EMS);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.OK);
    }

    public void multiPartFileStore(MultipartFile file, CompanyEntity company) throws IOException, EmployeeException {
        if(!file.isEmpty()){
            String filename = folderPath+company.getCompanyName()+"_"+file.getOriginalFilename();
            file.transferTo(new File(filename));
            company.setImageFile(filename);
            ResponseEntity.ok(filename);
        }
    }
    @Override
    public ResponseEntity<?> deleteCompanyById(String companyId) throws EmployeeException {
        log.info("getting details of {}", companyId);
        CompanyEntity companyEntity = null;
        try {
            companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
            if (companyEntity!=null) {
                openSearchOperations.deleteEntity(companyEntity.getId(),Constants.INDEX_EMS);
                System.out.println("THe conpany si i:"+companyEntity.getId());
            }
        } catch (Exception ex) {
            log.error("Exception while fetching company details {}", ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_DELETE_COMPANY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.DELETED), HttpStatus.OK);

    }*/


}