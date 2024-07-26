package com.pb.employee.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.model.ResourceType;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Collections;
import java.util.List;

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

    public static Entity unmaskCompanyProperties(CompanyEntity companyEntity) {
        String hra = null, pan = null, pf = null, spa = null, ta = null;
        if(companyEntity.getHraPercentage() != null) {
            hra = new String(Base64.getDecoder().decode(companyEntity.getHraPercentage().toString().getBytes()));
        }
        if(companyEntity.getPanNo() != null) {
            pan = new String(Base64.getDecoder().decode(companyEntity.getPanNo().toString().getBytes()));
        }
        if(companyEntity.getPfPercentage() != null) {
            pf = new String(Base64.getDecoder().decode(companyEntity.getPfPercentage().toString().getBytes()));
        }
        if(companyEntity.getSpecialAllowance() != null) {
            spa = new String(Base64.getDecoder().decode(companyEntity.getSpecialAllowance().toString().getBytes()));
        }
        if(companyEntity.getTravelAllowance() != null) {
            ta = new String(Base64.getDecoder().decode(companyEntity.getTravelAllowance().toString().getBytes()));
        }

        companyEntity.setHraPercentage(hra);
        companyEntity.setPassword("**********");
        companyEntity.setPanNo(pan);
        companyEntity.setPfPercentage(pf);
        companyEntity.setSpecialAllowance(spa);
        companyEntity.setTravelAllowance(ta);
        companyEntity.setType(Constants.COMPANY);
        return companyEntity;
    }

    public static CompanyEntity maskCompanyUpdateProperties(CompanyEntity existingEntity, CompanyUpdateRequest companyRequest) {

        // Convert CompanyUpdateRequest to CompanyEntity to update specific fields
        if (companyRequest.getPassword() == null || companyRequest.getPassword().isEmpty()) {
            existingEntity.setPassword(existingEntity.getPassword());
        } else {
            existingEntity.setPassword(Base64.getEncoder().encodeToString(companyRequest.getPassword().getBytes()));
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
        if(companyRequest.getCompanyAddress() != null) {
            existingEntity.setCompanyAddress(companyRequest.getCompanyAddress());
        }
        if(companyRequest.getMobileNo() != null) {
            existingEntity.setMobileNo(companyRequest.getMobileNo());
        }
        if(companyRequest.getLandNo() != null) {
            existingEntity.setLandNo(companyRequest.getLandNo());
        }
        if(companyRequest.getName() != null) {
            existingEntity.setName(companyRequest.getName());
        }
        if(companyRequest.getPersonalMailId() != null) {
            existingEntity.setPersonalMailId(companyRequest.getPersonalMailId());
        }
        if(companyRequest.getPersonalMobileNo() != null) {
            existingEntity.setPersonalMobileNo(companyRequest.getPersonalMobileNo());
        }
        if(companyRequest.getAddress() != null) {
            existingEntity.setAddress(companyRequest.getAddress());
        }
        if(companyRequest.getCompanyType() != null) {
            existingEntity.setCompanyType(companyRequest.getCompanyType());
        }
        if(companyRequest.getCompanyBranch() != null) {
            existingEntity.setCompanyBranch(companyRequest.getCompanyBranch());
        }
        if(pf != null) {
            existingEntity.setPfPercentage(pf);
        }
        if(spa != null) {
            existingEntity.setSpecialAllowance(spa);
        }
        if(ta != null) {
            existingEntity.setTravelAllowance(ta);
        }
        if(hra != null) {
            existingEntity.setHraPercentage(hra);
        }
        existingEntity.setType(Constants.COMPANY);
        return existingEntity;
    }
    public static CompanyEntity maskCompanyImageUpdateProperties(CompanyEntity existingEntity, CompanyImageUpdate companyRequest, String id) {
        if(companyRequest.getImage() != null){
            existingEntity.setImageFile(companyRequest.getImage());
        }

        return existingEntity;
    }


    public static Entity maskEmployeeProperties(EmployeeRequest employeeRequest, String id, String companyId) {
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
        entity.setCompanyId(companyId);
        entity.setType(Constants.EMPLOYEE);
        return entity;
    }


    public static Entity maskEmployeeUpdateProperties(EmployeeEntity user, EmployeeUpdateRequest employeeUpdateRequest) {
        if(employeeUpdateRequest.getPassword() != null) {
            String password = Base64.getEncoder().encodeToString(employeeUpdateRequest.getPassword().getBytes());
            user.setPassword(password);
        }
        if (employeeUpdateRequest.getEmployeeType() != null){
            user.setEmployeeType(employeeUpdateRequest.getEmployeeType());
        }
        if (employeeUpdateRequest.getDesignation() != null){
            user.setDesignation(employeeUpdateRequest.getDesignation());
        }
        if (employeeUpdateRequest.getManager() != null){
            user.setManager(employeeUpdateRequest.getManager());
        }
        if (employeeUpdateRequest.getRoles() != null){
            user.setRoles(Collections.singletonList(String.valueOf(employeeUpdateRequest.getRoles())));
        }
        if (employeeUpdateRequest.getEmailId() != null){
            user.setEmailId(employeeUpdateRequest.getEmailId());
        }
        if (employeeUpdateRequest.getLocation() != null){
            user.setLocation(employeeUpdateRequest.getLocation());
        }
        if (employeeUpdateRequest.getBankName() != null){
            user.setBankName(employeeUpdateRequest.getBankName());
        }
        if (employeeUpdateRequest.getAccountNo() != null){
            user.setAccountNo(employeeUpdateRequest.getAccountNo());
        }
        if (employeeUpdateRequest.getIfscCode() != null){
            user.setIfscCode(employeeUpdateRequest.getIfscCode());
        }
        if (employeeUpdateRequest.getStatus() != 0){
            user.setStatus(employeeUpdateRequest.getStatus());
        }

        return user;
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
        if(salaryRequest.getAllowances().getPfContributionEmployee() != null) {
            pfc = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getPfContributionEmployee().toString().getBytes()));
        }
        if(salaryRequest.getAllowances().getSpecialAllowance() != null) {
            spa = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getSpecialAllowance().toString().getBytes()));
        }

        if(salaryRequest.getTotalEarnings() != null) {
            te = (Base64.getEncoder().encodeToString(salaryRequest.getTotalEarnings().toString().getBytes()));
        }

        if(salaryRequest.getDeductions().getPfEmployee() != null) {
            pfE = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployee().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getPfEmployer() != null) {
            pfEmployer = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployer().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getLop() != null) {
            lop = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getLop().toString().getBytes()));
        }

//        if(salaryRequest.getDeductions().getPfTax() != null) {
//            tax = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfTax().toString().getBytes()));
//        }

        String grossAmount = salaryRequest.getGrossAmount(); // Assuming gross is a valid number string
        String totalDeductions = salaryRequest.getDeductions().getTotalDeductions(); // Assuming tded is a valid number string
        // Convert strings to doubles
        double grossAmountDouble = Double.parseDouble(grossAmount);
        double totalDeductionsDouble = Double.parseDouble(totalDeductions);
        itax = String.valueOf(TaxCalculatorUtils.getNewTax( grossAmountDouble));
        tax = String.valueOf(TaxCalculatorUtils.getPfTax(grossAmountDouble/12));


        if(salaryRequest.getGrossAmount() != null) {
            gross = (Base64.getEncoder().encodeToString(salaryRequest.getGrossAmount().toString().getBytes()));
        }
        if(salaryRequest.getDeductions().getTotalDeductions() != null) {
            tded = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getTotalDeductions().toString().getBytes()));
        }

            double pftax = Double.parseDouble(tax);
            double incomTax = Double.parseDouble(itax);
            ttax = String.valueOf(pftax+incomTax);
            ttax=(Base64.getEncoder().encodeToString(ttax.getBytes()));

        itax= (Base64.getEncoder().encodeToString(itax.getBytes()));
        tax= (Base64.getEncoder().encodeToString(tax.getBytes()));

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

    public static Entity maskUpdateSalary(SalaryRequest salaryRequest, SalaryEntity salary) {

        String var = null, fix = null, bas = null, gross = null;
        String hra = null, trav = null, pfc = null, other = null,spa=null;
        String te= null, pfE = null, pfEmployer =null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;
        if(salaryRequest.getFixedAmount() != null) {
            fix = (Base64.getEncoder().encodeToString(salaryRequest.getFixedAmount().toString().getBytes()));
            salary.setFixedAmount(fix);
        }
        if(salaryRequest.getVariableAmount() != null) {
            var = Base64.getEncoder().encodeToString(salaryRequest.getVariableAmount().toString().getBytes());
            salary.setVariableAmount(var);
        }
        if(salaryRequest.getGrossAmount() != null) {
            gross = (Base64.getEncoder().encodeToString(salaryRequest.getGrossAmount().toString().getBytes()));
            salary.setGrossAmount(gross);
           double income = TaxCalculatorUtils.getNewTax(Double.parseDouble(gross));
           double pfTax = TaxCalculatorUtils.getPfTax(Double.parseDouble(gross)/12);
            ttax = String.valueOf(pfTax+income);
            salary.getDeductions().setTotalTax(ttax);
            salary.getDeductions().setIncomeTax(String.valueOf(income));
            salary.getDeductions().setPfTax(String.valueOf(pfTax));
        }
        if(salaryRequest.getBasicSalary() != null) {
            bas = (Base64.getEncoder().encodeToString(salaryRequest.getBasicSalary().toString().getBytes()));
            salary.setBasicSalary(bas);

        }

        if(salaryRequest.getAllowances().getTravelAllowance() != null) {
            trav = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getTravelAllowance().toString().getBytes()));
            salary.getAllowances().setTravelAllowance(trav);
        }
        if(salaryRequest.getAllowances().getHra() != null) {
            hra =(Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getHra().toString().getBytes()));
            salary.getAllowances().setHra(hra);

        }
        if(salaryRequest.getAllowances().getOtherAllowances() != null) {
            other = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getOtherAllowances().toString().getBytes()));
            salary.getAllowances().setOtherAllowances(other);
        }
        if(salaryRequest.getAllowances().getPfContributionEmployee() != null) {
            pfc = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getPfContributionEmployee().toString().getBytes()));
            salary.getAllowances().setPfContributionEmployee(pfc);

        }
        if(salaryRequest.getAllowances().getSpecialAllowance() != null) {
            spa = (Base64.getEncoder().encodeToString(salaryRequest.getAllowances().getSpecialAllowance().toString().getBytes()));
            salary.getAllowances().setSpecialAllowance(spa);
        }

        if(salaryRequest.getTotalEarnings() != null) {
            te = (Base64.getEncoder().encodeToString(salaryRequest.getTotalEarnings().toString().getBytes()));
            salary.setTotalEarnings(te);

        }

        if(salaryRequest.getDeductions().getPfEmployee() != null) {
            pfE = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployee().toString().getBytes()));
            salary.getDeductions().setPfEmployee(pfE);

        }
        if(salaryRequest.getDeductions().getPfEmployer() != null) {
            pfEmployer = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getPfEmployer().toString().getBytes()));
            salary.getDeductions().setPfEmployer(pfEmployer);

        }
        if(salaryRequest.getDeductions().getLop() != null) {
            lop = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getLop().toString().getBytes()));
            salary.getDeductions().setLop(lop);

        }
        if(salaryRequest.getDeductions().getTotalDeductions() != null) {
            tded = (Base64.getEncoder().encodeToString(salaryRequest.getDeductions().getTotalDeductions().toString().getBytes()));
            salary.getDeductions().setTotalDeductions(tded);

        }
        if(salaryRequest.getNetSalary() != null) {
            net = (Base64.getEncoder().encodeToString(salaryRequest.getNetSalary().toString().getBytes()));
            salary.setNetSalary(net);

        }

        salary.setType(Constants.SALARY);
        return salary;
    }

    public static Entity maskAttendanceProperties(AttendanceRequest attendanceRequest, String attendanceId, String employeeId) {
        String totalWd = null, noOfWd = null,fn=null,email=null,ln=null;
        if(attendanceRequest.getTotalWorkingDays() != null) {
            totalWd = (Base64.getEncoder().encodeToString(attendanceRequest.getTotalWorkingDays().getBytes()));
        }if(attendanceRequest.getNoOfWorkingDays()!= null) {
            noOfWd = (Base64.getEncoder().encodeToString(attendanceRequest.getNoOfWorkingDays().getBytes()));
        }
        if(attendanceRequest.getEmailId()!= null) {
            email = (Base64.getEncoder().encodeToString(attendanceRequest.getEmailId().getBytes()));
        }
        if(attendanceRequest.getFirstName()!= null) {
            fn = (Base64.getEncoder().encodeToString(attendanceRequest.getFirstName().getBytes()));
        }
        if(attendanceRequest.getLastName()!= null) {
            ln = (Base64.getEncoder().encodeToString(attendanceRequest.getLastName().getBytes()));
        }
        ObjectMapper objectMapper = new ObjectMapper();

        AttendanceEntity entity = objectMapper.convertValue(attendanceRequest, AttendanceEntity.class);

        entity.setAttendanceId(attendanceId);
        entity.setEmployeeId(employeeId);
        entity.setTotalWorkingDays(totalWd);
        entity.setNoOfWorkingDays(noOfWd);
        entity.setFirstName(fn);
        entity.setLastName(ln);
        entity.setEmailId(email);
        entity.setType(Constants.ATTENDANCE);

        return entity;
    }

    public static Entity maskAttendanceUpdateProperties(AttendanceUpdateRequest attendanceRequest, AttendanceEntity attendance) {
        String totalWd = null, noOfWd = null;

        if(attendanceRequest.getTotalWorkingDays() != null) {
            totalWd = (Base64.getEncoder().encodeToString(attendanceRequest.getTotalWorkingDays().getBytes()));
            attendance.setTotalWorkingDays(totalWd);

        }if(attendanceRequest.getNoOfWorkingDays()!= null) {
            noOfWd = (Base64.getEncoder().encodeToString(attendanceRequest.getNoOfWorkingDays().getBytes()));
            attendance.setNoOfWorkingDays(noOfWd);

        }
        return attendance;
    }
    public static Entity unMaskAttendanceProperties(AttendanceEntity entity){
        String totalWd = null, noOfWd = null,email=null,fn=null,ln=null;

        if(entity.getTotalWorkingDays() != null) {
            totalWd = new String(Base64.getDecoder().decode(entity.getTotalWorkingDays()));
        }if(entity.getNoOfWorkingDays()!= null) {
            noOfWd = new String(Base64.getDecoder().decode(entity.getNoOfWorkingDays()));
        }
        if(entity.getEmailId()!= null) {
            email = new String(Base64.getDecoder().decode(entity.getEmailId()));
        }
        if(entity.getFirstName()!= null) {
            fn = new String(Base64.getDecoder().decode(entity.getFirstName()));
        }
        if(entity.getLastName()!= null) {
            ln = new String(Base64.getDecoder().decode(entity.getLastName()));
        }
        entity.setTotalWorkingDays(totalWd);
        entity.setNoOfWorkingDays(noOfWd);
        entity.setEmailId(email);
        entity.setFirstName(fn);
        entity.setLastName(ln);
        entity.setType(Constants.ATTENDANCE);

        return entity;
    }

}