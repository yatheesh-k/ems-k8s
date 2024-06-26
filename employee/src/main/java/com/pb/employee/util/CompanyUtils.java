package com.pb.employee.util;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.model.ResourceType;
import com.pb.employee.persistance.model.CompanyEntity;
import com.pb.employee.persistance.model.EmployeeEntity;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.request.*;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Base64;
import java.util.Date;

@Slf4j
@Component
public class CompanyUtils {

    public static Entity maskCompanyProperties(CompanyRequest companyRequest, String id) {
        String password = Base64.getEncoder().encodeToString(companyRequest.getPassword().getBytes());
        String hra = null, pan = null, pf = null, spa = null, ta = null;
        if(companyRequest.getHraPercentage() != null) {
            hra = Base64.getEncoder().encodeToString(companyRequest.getHraPercentage().toString().getBytes());
        }
        if(companyRequest.getPanNo() != null) {
            pan = Base64.getEncoder().encodeToString(companyRequest.getPanNo().getBytes());
        }
        if(companyRequest.getPfPercentage() != null) {
            pf = Base64.getEncoder().encodeToString(companyRequest.getPfPercentage().toString().getBytes());
        }
        if(companyRequest.getSpecialAllowance() != null) {
            spa = Base64.getEncoder().encodeToString(companyRequest.getSpecialAllowance().toString().getBytes());
        }
        if(companyRequest.getTravelAllowance() != null) {
            ta = Base64.getEncoder().encodeToString(companyRequest.getTravelAllowance().toString().getBytes());
        }
        ObjectMapper objectMapper = new ObjectMapper();

        CompanyEntity entity = objectMapper.convertValue(companyRequest, CompanyEntity.class);
        entity.setId(id);
        entity.setPassword(password);
        entity.setHraPercentage(hra);
        entity.setPanNo(pan);
        entity.setPfPercentage(pf);
        entity.setSpecialAllowance(spa);
        entity.setTravelAllowance(ta);
        entity.setType(Constants.COMPANY);
        return entity;
    }
    public static CompanyEntity maskCompanyUpdateProperties(CompanyEntity existingEntity, CompanyUpdateRequest companyRequest, String id) {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert CompanyUpdateRequest to CompanyEntity to update specific fields
        CompanyEntity updatedEntity = objectMapper.convertValue(companyRequest, CompanyEntity.class);

        // Ensure existing fields are preserved if not updated
        if (companyRequest.getPassword() == null || companyRequest.getPassword().isEmpty()) {
            updatedEntity.setPassword(existingEntity.getPassword());
        } else {
            updatedEntity.setPassword(Base64.getEncoder().encodeToString(companyRequest.getPassword().getBytes()));
        }
        String hra = null, pf = null, spa = null, ta = null;

        if(companyRequest.getHraPercentage() != null) {
            hra = Base64.getEncoder().encodeToString(companyRequest.getHraPercentage().toString().getBytes());
        }
        if(companyRequest.getPfPercentage() != null) {
            pf = Base64.getEncoder().encodeToString(companyRequest.getPfPercentage().toString().getBytes());
        }
        if(companyRequest.getSpecialAllowance() != null) {
            spa = Base64.getEncoder().encodeToString(companyRequest.getSpecialAllowance().toString().getBytes());
        }
        if(companyRequest.getTravelAllowance() != null) {
            ta = Base64.getEncoder().encodeToString(companyRequest.getTravelAllowance().toString().getBytes());
        }
        // Set common fields
        updatedEntity.setId(id);
        updatedEntity.setCompanyName(existingEntity.getCompanyName()); // Ensure companyName is preserved
        updatedEntity.setEmailId(existingEntity.getEmailId());
        updatedEntity.setCompanyRegNo(existingEntity.getCompanyRegNo());
        updatedEntity.setGstNo(existingEntity.getGstNo());
        updatedEntity.setPanNo(existingEntity.getPanNo());
        updatedEntity.setCinNo(existingEntity.getCinNo());
        updatedEntity.setShortName(existingEntity.getShortName());
        updatedEntity.setHraPercentage(hra);
        updatedEntity.setPfPercentage(pf);
        updatedEntity.setSpecialAllowance(spa);
        updatedEntity.setTravelAllowance(ta);
        updatedEntity.setType(Constants.COMPANY);

        return updatedEntity;
    }
    public static CompanyEntity maskCompanyImageUpdateProperties(CompanyEntity existingEntity, CompanyImageUpdate companyRequest, String id) {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert CompanyUpdateRequest to CompanyEntity to update specific fields
        CompanyEntity updatedEntity = objectMapper.convertValue(companyRequest, CompanyEntity.class);

        // Ensure existing fields are preserved if not updated
        // Set common fields
        updatedEntity.setId(id);
        updatedEntity.setCompanyName(existingEntity.getCompanyName()); // Ensure companyName is preserved
        updatedEntity.setEmailId(existingEntity.getEmailId());
        updatedEntity.setPassword(existingEntity.getPassword());
        updatedEntity.setCompanyAddress(existingEntity.getCompanyAddress());
        updatedEntity.setCompanyRegNo(existingEntity.getCompanyRegNo());
        updatedEntity.setMobileNo(existingEntity.getMobileNo());
        updatedEntity.setLandNo(existingEntity.getLandNo());
        updatedEntity.setGstNo(existingEntity.getGstNo());
        updatedEntity.setPanNo(existingEntity.getPanNo());
        updatedEntity.setName(existingEntity.getName());
        updatedEntity.setPersonalMailId(existingEntity.getPersonalMailId());
        updatedEntity.setPersonalMobileNo(existingEntity.getPersonalMobileNo());
        updatedEntity.setAddress(existingEntity.getAddress());
        updatedEntity.setCompanyType(existingEntity.getCompanyType());
        updatedEntity.setCompanyBranch(existingEntity.getCompanyBranch());
        updatedEntity.setCinNo(existingEntity.getCinNo());
        updatedEntity.setShortName(existingEntity.getShortName());
        updatedEntity.setHraPercentage(existingEntity.getHraPercentage());
        updatedEntity.setPfPercentage(existingEntity.getPfPercentage());
        updatedEntity.setSpecialAllowance(existingEntity.getSpecialAllowance());
        updatedEntity.setTravelAllowance(existingEntity.getTravelAllowance());
        updatedEntity.setType(Constants.COMPANY);

        return updatedEntity;
    }


    public static Entity maskEmployeeProperties(EmployeeRequest employeeRequest, String id) {
        String password = Base64.getEncoder().encodeToString(employeeRequest.getPassword().getBytes());
        String hra = null, pan = null, pf = null, spa = null, ta = null;
        if(employeeRequest.getPanNo() != null) {
            pan = Base64.getEncoder().encodeToString(employeeRequest.getPanNo().getBytes());
        }
        ObjectMapper objectMapper = new ObjectMapper();

        EmployeeEntity entity = objectMapper.convertValue(employeeRequest, EmployeeEntity.class);
        entity.setId(id);
        entity.setPassword(password);
        entity.setPanNo(pan);
        entity.setType(Constants.EMPLOYEE);
        return entity;
    }

    public static Entity maskEmployeeUpdateProperties(EmployeeEntity user, EmployeeUpdateRequest employeeUpdateRequest, String id) {
        ObjectMapper objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        EmployeeEntity updatedEntity = objectMapper.convertValue(employeeUpdateRequest, EmployeeEntity.class);

        String password = Base64.getEncoder().encodeToString(employeeUpdateRequest.getPassword().getBytes());
        String hra = null,  pf = null, spa = null, ta = null;

        updatedEntity.setId(id);
        updatedEntity.setEmployeeId(user.getEmployeeId());
        updatedEntity.setPanNo(user.getPanNo());
        updatedEntity.setDateOfBirth(user.getDateOfBirth());
        updatedEntity.setDateOfHiring(user.getDateOfHiring());
        updatedEntity.setFirstName(user.getFirstName());
        updatedEntity.setLastName(user.getLastName());
        updatedEntity.setDepartment(user.getDepartment());
        updatedEntity.setUanNo(user.getUanNo());
        updatedEntity.setPassword(password);
        updatedEntity.setType(Constants.EMPLOYEE);
        return updatedEntity;
    }



}