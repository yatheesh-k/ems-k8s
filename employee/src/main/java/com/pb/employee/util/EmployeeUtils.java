package com.pb.employee.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Component
public class EmployeeUtils {


    public static Entity maskEmployeeProperties(EmployeeRequest employeeRequest,String resourceId, String companyId) {
        String uan = null, pan = null, adharId = null, accountNo=null, ifscCode = null,password=null;
        if(employeeRequest.getPanNo() != null) {
            pan = Base64.getEncoder().encodeToString(employeeRequest.getPanNo().getBytes());
        }
        if(employeeRequest.getPassword() != null) {
            password = Base64.getEncoder().encodeToString(employeeRequest.getPassword().getBytes());
        }
        if(employeeRequest.getUanNo() != null) {
            uan = Base64.getEncoder().encodeToString(employeeRequest.getUanNo().getBytes());
        }
        if(employeeRequest.getAadhaarId() != null) {
            adharId = Base64.getEncoder().encodeToString(employeeRequest.getAadhaarId().getBytes());
        }
        if(employeeRequest.getIfscCode() != null) {
            ifscCode = Base64.getEncoder().encodeToString(employeeRequest.getIfscCode().getBytes());
        }
        if(employeeRequest.getAccountNo() != null) {
            accountNo = Base64.getEncoder().encodeToString(employeeRequest.getAccountNo().getBytes());
        }
        ObjectMapper objectMapper = new ObjectMapper();

        EmployeeEntity entity = objectMapper.convertValue(employeeRequest, EmployeeEntity.class);
        entity.setId(resourceId);
        entity.setCompanyId(companyId);
        entity.setPassword(password);
        entity.setAadhaarId(adharId);
        entity.setPanNo(pan);
        entity.setUanNo(uan);
        entity.setIfscCode(ifscCode);
        entity.setAccountNo(accountNo);
        entity.setType(Constants.EMPLOYEE);
        return entity;
    }


    public static Entity unmaskEmployeeProperties(EmployeeEntity employeeEntity, DepartmentEntity entity, DesignationEntity designationEntity) {
        String pan = null,uanNo=null,aadhaarId=null,accountNo=null,ifscCode=null;
        if(employeeEntity.getPanNo() != null) {
            pan = new String((Base64.getDecoder().decode(employeeEntity.getPanNo().toString().getBytes())));
        }
        if(employeeEntity.getUanNo() != null) {
            uanNo = new String((Base64.getDecoder().decode(employeeEntity.getUanNo().toString().getBytes())));
        }
        if(employeeEntity.getAadhaarId() != null) {
            aadhaarId = new String((Base64.getDecoder().decode(employeeEntity.getAadhaarId().toString().getBytes())));
        }
        if(employeeEntity.getAccountNo() != null) {
            accountNo = new String((Base64.getDecoder().decode(employeeEntity.getAccountNo().toString().getBytes())));
        }
        if(employeeEntity.getIfscCode() != null) {
            ifscCode = new String((Base64.getDecoder().decode(employeeEntity.getIfscCode().toString().getBytes())));
        }
        if (employeeEntity.getDepartment() != null){
            employeeEntity.setDepartmentName(entity.getName());
        }
        if (employeeEntity.getDesignation() != null){
            employeeEntity.setDesignationName(designationEntity.getName());
        }
        employeeEntity.setIfscCode(ifscCode);
        employeeEntity.setAccountNo(accountNo);
        employeeEntity.setAadhaarId(aadhaarId);
        employeeEntity.setUanNo(uanNo);
        employeeEntity.setPassword("**********");
        employeeEntity.setPanNo(pan);
        return employeeEntity;
    }
    public static SalaryEntity unMaskEmployeeSalaryProperties(SalaryEntity salaryEntity) {

        String var = null, fix = null, bas = null, gross = null;
        String hra = null, trav = null, pfc = null, other = null,spa=null;
        String te= null, pfE = null, pfEmployer =null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;
        if(salaryEntity.getFixedAmount() != null) {
            fix = new String((Base64.getDecoder().decode(salaryEntity.getFixedAmount().toString().getBytes())));
        }
        if(salaryEntity.getVariableAmount() != null) {
            var = new String(Base64.getDecoder().decode(salaryEntity.getVariableAmount().toString().getBytes()));
        }
        if(salaryEntity.getGrossAmount() != null) {
            gross = new String((Base64.getDecoder().decode(salaryEntity.getGrossAmount().toString().getBytes())));
        }
        if(salaryEntity.getBasicSalary() != null) {
            bas = new String((Base64.getDecoder().decode(salaryEntity.getBasicSalary().toString().getBytes())));
        }

        if(salaryEntity.getAllowances().getTravelAllowance() != null) {
            trav = new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getTravelAllowance().toString().getBytes())));
        }
        if(salaryEntity.getAllowances().getHra() != null) {
            hra =new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getHra().toString().getBytes())));
        }
        if(salaryEntity.getAllowances().getOtherAllowances() != null) {
            other = new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getOtherAllowances().toString().getBytes())));
        }
        if(salaryEntity.getAllowances().getPfContributionEmployee() != null) {
            pfc = new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getPfContributionEmployee().toString().getBytes())));
        }

        if(salaryEntity.getAllowances().getSpecialAllowance() != null) {
            spa = new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getSpecialAllowance().toString().getBytes())));
        }

        if(salaryEntity.getTotalEarnings() != null) {
            te = new String((Base64.getDecoder().decode(salaryEntity.getTotalEarnings().toString().getBytes())));
        }

        if(salaryEntity.getDeductions().getPfEmployee() != null) {
            pfE = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfEmployee().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getPfEmployer() != null) {
            pfEmployer = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfEmployer().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getLop() != null) {
            lop = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getLop().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getTotalDeductions() != null) {
            tded = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getTotalDeductions().toString().getBytes())));
        }

        if(salaryEntity.getDeductions().getPfTax() != null) {
            tax = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfTax().toString().getBytes())));
        }
//        Double grossAmount = Double.parseDouble(gross);
//        Double totalDeductions = Double.valueOf(tded);
//        itax = String.valueOf(TaxCalculatorUtils.getNewTax( grossAmount-totalDeductions));

        if (salaryEntity.getDeductions().getIncomeTax() != null){
            itax = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getIncomeTax().toString().getBytes())));
        }

        if(salaryEntity.getDeductions().getTotalTax() != null) {
            ttax = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getTotalTax().toString().getBytes())));
        }

        if(salaryEntity.getNetSalary() != null) {
            net = new String((Base64.getDecoder().decode(salaryEntity.getNetSalary().toString().getBytes())));
        }

        salaryEntity.setFixedAmount(fix);
        salaryEntity.setGrossAmount(gross);
        salaryEntity.setVariableAmount(var);
        salaryEntity.setBasicSalary(bas);
        salaryEntity.getAllowances().setSpecialAllowance(spa);
        salaryEntity.getAllowances().setOtherAllowances(other);
        salaryEntity.getAllowances().setTravelAllowance(trav);
        salaryEntity.getAllowances().setHra(hra);
        salaryEntity.getAllowances().setPfContributionEmployee(pfc);
        salaryEntity.setTotalEarnings(te);
        salaryEntity.getDeductions().setPfEmployee(pfE);
        salaryEntity.getDeductions().setPfEmployer(pfEmployer);
        salaryEntity.getDeductions().setLop(lop);
        salaryEntity.getDeductions().setPfTax(tax);
        salaryEntity.getDeductions().setIncomeTax(itax);
        salaryEntity.getDeductions().setTotalTax(ttax);
        salaryEntity.getDeductions().setTotalDeductions(tded);
        salaryEntity.setNetSalary(net);
        salaryEntity.setType(Constants.SALARY);
        return salaryEntity;
    }
}