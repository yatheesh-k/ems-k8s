package com.pb.employee.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.persistance.model.CompanyEntity;
import com.pb.employee.persistance.model.EmployeeEntity;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.persistance.model.SalaryEntity;
import com.pb.employee.request.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Slf4j
@Component
public class EmployeeUtils {


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


    public static Entity maskEmployeeSalaryProperties(SalaryRequest salaryRequest, String id,String employeeId) {

        String var = null, fix = null, bas = null, gross = null;
        String hra = null, trav = null, pfc = null, other = null,spa=null;
        String te= null, pfE = null, pfEmployer =null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;
        if(salaryRequest.getFixedAmount() != null) {
            fix = (Base64.getEncoder().encodeToString(salaryRequest.getFixedAmount().toString().getBytes()));
        }
        if(salaryRequest.getVariableAmount() != null) {
            var = Base64.getEncoder().encodeToString(salaryRequest.getVariableAmount().toString().getBytes());
        }
        if(salaryRequest.getGrossAmount() != null) {
            gross = (Base64.getEncoder().encodeToString(salaryRequest.getGrossAmount().toString().getBytes()));
        }
        if(salaryRequest.getBasicSalary() != null) {
            bas = (Base64.getEncoder().encodeToString(salaryRequest.getBasicSalary().toString().getBytes()));
        }

        if(salaryRequest.getAllowances().getTravelAllowance() != null) {
            trav = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getTravelAllowance().toString().getBytes()));
        }
        if(salaryRequest.getAllowances().getHra() != null) {
            hra =(Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getHra().toString().getBytes()));
        }
        if(salaryRequest.getAllowances().getOtherAllowances() != null) {
            other = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getOtherAllowances().toString().getBytes()));
        }
        if(salaryRequest.getAllowances().getSpecialAllowance() != null) {
            spa = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getSpecialAllowance().toString().getBytes()));
        }

        if(salaryRequest.getTotalEarnings() != null) {
            te = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getTravelAllowance().toString().getBytes()));
        }

        if(salaryRequest.getDeductions().getPfEmployee() != null) {
            pfE = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployee().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getPfEmployer() != null) {
            pfEmployer = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployer().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getLop() != null) {
            lop = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployee().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getTotalDeductions() != null) {
            tded = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getTotalDeductions().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getTotalDeductions() != null) {
            tded = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getTotalDeductions().toString().getBytes()));
        }

        if(salaryRequest.getDeductions().getPfTax() != null) {
            tax = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfTax().toString().getBytes()));
        }
        Double grossAmount =salaryRequest.getGrossAmount();
        Double totalDeductions = Double.valueOf(salaryRequest.getDeductions().getTotalDeductions());
        itax = String.valueOf(TaxCalculatorUtils.getOldTax( grossAmount-totalDeductions));
        itax= (Base64.getEncoder().encodeToString(itax.getBytes()));


        if(salaryRequest.getDeductions().getTotalTax() != null) {
            ttax = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getTotalTax().toString().getBytes()));
        }

        if(salaryRequest.getNetSalary() != null) {
            net = (Base64.getEncoder().encodeToString(salaryRequest.getNetSalary().toString().getBytes()));
        }

        ObjectMapper objectMapper = new ObjectMapper();

        SalaryEntity entity = objectMapper.convertValue(salaryRequest, SalaryEntity.class);

        entity.setSalaryId(id);
        entity.setEmployeeId(employeeId);
        entity.setFixedAmount(fix);
        entity.setGrossAmount(gross);
        entity.setVariableAmount(var);
        entity.setBasicSalary(bas);
        entity.getAllowances().setSpecialAllowance(spa);
        entity.getAllowances().setOtherAllowances(other);
        entity.getAllowances().setTravelAllowance(trav);
        entity.getAllowances().setHra(hra);
        entity.getAllowances().setPfContributionEmployee(pfc);
        entity.setTotalEarnings(te);
        entity.getDeductions().setPfEmployee(pfE);
        entity.getDeductions().setPfEmployer(pfEmployer);
        entity.getDeductions().setLop(lop);
        entity.getDeductions().setPfTax(tax);
        entity.getDeductions().setIncomeTax(itax);
        entity.getDeductions().setTotalTax(ttax);
        entity.getDeductions().setTotalDeductions(tded);
        entity.setNetSalary(net);
        entity.setType(Constants.SALARY);
        return entity;
    }

    public static Entity unMaskEmployeeSalaryProperties(SalaryEntity salaryEntity) {

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
        if(salaryEntity.getAllowances().getSpecialAllowance() != null) {
            spa = new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getSpecialAllowance().toString().getBytes())));
        }

        if(salaryEntity.getTotalEarnings() != null) {
            te = new String((Base64.getDecoder().decode(salaryEntity.getAllowances().getTravelAllowance().toString().getBytes())));
        }

        if(salaryEntity.getDeductions().getPfEmployee() != null) {
            pfE = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfEmployee().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getPfEmployer() != null) {
            pfEmployer = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfEmployer().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getLop() != null) {
            lop = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfEmployee().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getTotalDeductions() != null) {
            tded = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getTotalDeductions().toString().getBytes())));
        }
        if(salaryEntity.getDeductions().getTotalDeductions() != null) {
            tded = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getTotalDeductions().toString().getBytes())));
        }

        if(salaryEntity.getDeductions().getPfTax() != null) {
            tax = new String((Base64.getDecoder().decode(salaryEntity.getDeductions().getPfTax().toString().getBytes())));
        }
        Double grossAmount = Double.parseDouble(gross);
        Double totalDeductions = Double.valueOf(tded);
        itax = String.valueOf(TaxCalculatorUtils.getNewTax( grossAmount-totalDeductions));

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