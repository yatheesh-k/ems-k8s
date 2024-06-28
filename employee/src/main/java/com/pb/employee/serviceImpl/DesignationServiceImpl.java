package com.pb.employee.serviceImpl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.DesignationEntity;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.request.DesignationRequest;
import com.pb.employee.request.DesignationUpdateRequest;
import com.pb.employee.service.DesignationService;
import com.pb.employee.util.ResourceIdUtils;
import com.pb.employee.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
public class DesignationServiceImpl implements DesignationService {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Override
    public ResponseEntity<?> registerDesignation(DesignationRequest designationRequest) throws EmployeeException{
        // Check if a company with the same short or company name already exists
        log.debug("validating name {} existed ", designationRequest.getName());

        String resourceId = ResourceIdUtils.generateDesignationResourceId(designationRequest.getName());
        Object entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(designationRequest.getCompanyName());
        try{
            entity = openSearchOperations.getById(resourceId, null, index);
            if(entity != null) {
                log.error("designation details existed{}", designationRequest.getName());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.DESIGNATION_ID_ALREADY_EXISTS), designationRequest.getName()),
                        HttpStatus.CONFLICT);
            }
        } catch (IOException e) {
            log.error("Unable to get the designation details {}", designationRequest.getName());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_DESIGNATION), designationRequest.getName()),
                    HttpStatus.BAD_REQUEST);
        }

        List<DesignationEntity> designationEntities = openSearchOperations.getCompanyDesignationByName(designationRequest.getCompanyName(), designationRequest.getName());
        if(designationEntities !=null && designationEntities.size() > 0) {
            log.error("Designation with name {} already existed", designationRequest.getName());
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.DESIGNATION_ID_ALREADY_EXISTS), designationRequest.getName()),
                    HttpStatus.CONFLICT);
        }
        try{

            Entity designationEntity = DesignationEntity.builder().id(resourceId).name(designationRequest.getName())
                    .type(Constants.DESIGNATION).build();
            Entity result = openSearchOperations.saveEntity(designationEntity, resourceId, index);
        } catch (Exception exception) {
            log.error("Unable to save the designation details {} {}", designationRequest.getName(),exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_SAVE_DESIGNATION),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);

    }

    @Override
    public ResponseEntity<?> getDesignation(String companyName) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        List<DesignationEntity> designationEntities = null;
        try {
            designationEntities = openSearchOperations.getCompanyDesignationByName(companyName, null);
        } catch (Exception ex) {
            log.error("Exception while fetching designation for company {}: {}", companyName, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(designationEntities), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getDesignationById(String companyName, String designationId) throws EmployeeException {
        log.info("getting details of {}", designationId);
        Object entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        try {
            entity = openSearchOperations.getById(designationId, null, index);

        } catch (Exception ex) {
            log.error("Exception while fetching designation details {}", ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_DESIGNATION),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(entity), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> updateDesignationById(String designationId, DesignationUpdateRequest designationUpdateRequest) throws EmployeeException {
        log.info("getting details of {}", designationId);
        DesignationEntity designationEntity;
        String index = ResourceIdUtils.generateCompanyIndex(designationUpdateRequest.getCompanyName());
        try {
            designationEntity = openSearchOperations.getDesignationById(designationId, null, index);
            if (designationEntity == null) {
                log.error("unable to find the designation");
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_DESIGNATION),
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {

            log.error("Exception while fetching designation details {}", ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_DESIGNATION),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Entity entity = DesignationEntity.builder().id(designationId).name(designationUpdateRequest.getName())
                .type(Constants.DESIGNATION).build();
        openSearchOperations.saveEntity(entity, designationId, index);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> deleteDesignation(String companyName, String designationId) throws EmployeeException {
        log.info("getting details of {}", designationId);
        Object entity = null;
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        try {
            entity = openSearchOperations.getById(designationId, null, index);

            if (entity!=null) {
                openSearchOperations.deleteEntity(designationId,index);
            } else {
                log.error("unable to find designation");
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_DESIGNATION),
                        HttpStatus.NOT_FOUND);
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