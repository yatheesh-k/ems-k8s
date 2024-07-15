package com.pb.employee.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.persistance.model.AttendanceEntity;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.persistance.model.PayslipEntity;
import com.pb.employee.persistance.model.SalaryEntity;
import com.pb.employee.request.PayslipRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Base64;

@Component
@Service
@Slf4j
public class PayslipUtils {

    public static PayslipEntity maskEmployeePayslipProperties(SalaryEntity salaryRequest, PayslipRequest payslipRequest, AttendanceEntity attendance, String id, String employeeId) {
        Double var = null, fix = null, bas = null, gross = null;
        Double hra = null, trav = null, pfc = null, other = null, spa = null;
        Double te = null, pfE = null, pfEmployer = null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;
        int totalWorkingDays = 0, noOfWorkingDays=0;

        if (attendance.getNoOfWorkingDays() !=null){
            byte[] decodedFix = Base64.getDecoder().decode(attendance.getNoOfWorkingDays());
            noOfWorkingDays= Integer.parseInt(new String(decodedFix));
        }
        if (attendance.getTotalWorkingDays() !=null){
            byte[] decodedFix = Base64.getDecoder().decode(attendance.getTotalWorkingDays());
            totalWorkingDays= Integer.parseInt(new String(decodedFix));
        }

        if (salaryRequest.getFixedAmount() != null) {
            byte[] decodedFix = Base64.getDecoder().decode(salaryRequest.getFixedAmount());
            fix = Double.parseDouble(new String(decodedFix));

        }
        if (salaryRequest.getVariableAmount() != null) {
            byte[] decodedVar = Base64.getDecoder().decode(salaryRequest.getVariableAmount());
            var = Double.parseDouble(new String(decodedVar));
        }

        if (salaryRequest.getGrossAmount() != null) { //annual
            byte[] decodedGross = Base64.getDecoder().decode(salaryRequest.getGrossAmount());
            gross = Double.parseDouble(new String(decodedGross));
        }
        if (salaryRequest.getBasicSalary() != null) { // monthly
            byte[] decodedBas = Base64.getDecoder().decode(salaryRequest.getBasicSalary());
            bas = Double.parseDouble(new String(decodedBas));
        }

        if (salaryRequest.getAllowances().getTravelAllowance() != null) {
            byte[] decodedTrav = Base64.getDecoder().decode(salaryRequest.getAllowances().getTravelAllowance());
            trav= Double.parseDouble(new String(decodedTrav));
            trav =  trav/12.0;
        }
        if (salaryRequest.getDeductions().getPfEmployee() != null) {
            byte[] decodedPfEmployee = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployee());
            byte[] decodedPfEmployer = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployer());
            pfc = Double.parseDouble(new String(decodedPfEmployee)) + Double.parseDouble(new String(decodedPfEmployer));
            pfc = pfc/12.0;
        }
        if (salaryRequest.getAllowances().getHra() != null) {
            byte[] decodedHra = Base64.getDecoder().decode(salaryRequest.getAllowances().getHra());
            hra = Double.parseDouble(new String(decodedHra));
            hra = ((gross/12.0)*(hra/100));
        }
        if (salaryRequest.getAllowances().getSpecialAllowance() != null) {
            byte[] decodedSpa = Base64.getDecoder().decode(salaryRequest.getAllowances().getSpecialAllowance());
            spa = Double.parseDouble(new String(decodedSpa));
            spa = spa/12.0;
        }
        if (salaryRequest.getAllowances().getOtherAllowances() != null) {
            byte[] decodedOther = Base64.getDecoder().decode(salaryRequest.getAllowances().getOtherAllowances());
            other = Double.parseDouble(new String(decodedOther));
            other = other/12.0;
        }
        bas = ((gross/12.0)-(other+spa+hra+pfc+trav));

        if (salaryRequest.getTotalEarnings() != null) {
            byte[] decodedTe = Base64.getDecoder().decode(salaryRequest.getTotalEarnings());
            te = Double.parseDouble(new String(decodedTe));
            te = bas+other+spa+hra+pfc+trav;
        }


        if (salaryRequest.getDeductions().getPfEmployee() != null) {
            byte[] decodedPfE = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployee());
            pfE = Double.parseDouble(new String(decodedPfE));
            pfE = pfE/12.0;
        }
        if (salaryRequest.getDeductions().getPfEmployer() != null) {
            byte[] decodedPfEmployer = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployer());
            pfEmployer = Double.parseDouble(new String(decodedPfEmployer));
            pfEmployer = pfEmployer/12.0;
        }
        if (salaryRequest.getDeductions().getLop() != null) {

            int noOfLeaves = totalWorkingDays-noOfWorkingDays;
            if (noOfLeaves > 1){
              double monthlySalary =  (gross/12.0);
              double perDaySalary = monthlySalary/totalWorkingDays;
              lop = noOfLeaves*perDaySalary;
            }

        }
        if (salaryRequest.getDeductions().getTotalDeductions() != null) {
            byte[] decodedTded = Base64.getDecoder().decode(salaryRequest.getDeductions().getTotalDeductions());
            tded = Double.parseDouble(new String(decodedTded));
            tded = lop+pfEmployer+pfE;
        }

        if (salaryRequest.getDeductions().getPfTax() != null) {
            byte[] decodedTax = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfTax());
            tax = Double.parseDouble(new String(decodedTax));
            tax = tax/12.0;
        }
        if (salaryRequest.getDeductions().getIncomeTax() != null) {
            byte[] decodedItax = Base64.getDecoder().decode(salaryRequest.getDeductions().getIncomeTax());

            itax = Double.parseDouble(new String(decodedItax));
            itax = itax/12.0;

        }
        if (salaryRequest.getDeductions().getTotalTax() != null) {
            byte[] decodedTtax = Base64.getDecoder().decode(salaryRequest.getDeductions().getTotalTax());
            ttax = Double.parseDouble(new String(decodedTtax));
            ttax = tax+itax;
        }

        if (salaryRequest.getNetSalary() != null) {
            byte[] decodedNet = Base64.getDecoder().decode(salaryRequest.getNetSalary());
            net = Double.parseDouble(new String(decodedNet));
            net = te-tded-ttax;

        }

        ObjectMapper objectMapper = new ObjectMapper();


        PayslipEntity payslipEntity = objectMapper.convertValue(payslipRequest, PayslipEntity.class);

        payslipEntity.setPayslipId(id);
        payslipEntity.setAttendanceId(attendance.getAttendanceId());
        payslipEntity.setMonth(payslipRequest.getMonth());
        payslipEntity.setYear(payslipRequest.getYear());
        payslipEntity.setEmployeeId(employeeId);
        payslipEntity.setSalaryId(salaryRequest.getSalaryId());

        AttendanceEntity attendanceEntity = objectMapper.convertValue(attendance,AttendanceEntity.class);
        attendanceEntity.setMonth(attendance.getMonth());
        attendanceEntity.setYear(attendance.getYear());
        attendanceEntity.setTotalWorkingDays(attendance.getTotalWorkingDays());
        attendanceEntity.setNoOfWorkingDays(attendance.getNoOfWorkingDays());

        SalaryEntity salary = objectMapper.convertValue(salaryRequest,SalaryEntity.class);
        salary.setFixedAmount(String.valueOf(fix));
        salary.setGrossAmount(String.valueOf(gross));
        salary.setVariableAmount(String.valueOf(var));
        salary.setBasicSalary(String.valueOf(bas));
        salary.getAllowances().setSpecialAllowance(String.valueOf(spa));
        salary.getAllowances().setOtherAllowances(String.valueOf(other));
        salary.getAllowances().setTravelAllowance(String.valueOf(trav));
        salary.getAllowances().setHra(String.valueOf(hra));
        salary.getAllowances().setPfContributionEmployee(String.valueOf(pfc));
        salary.setTotalEarnings(String.valueOf(te));
        salary.getDeductions().setPfEmployee(String.valueOf(pfE));
        salary.getDeductions().setPfEmployer(String.valueOf(pfEmployer));
        salary.getDeductions().setLop(String.valueOf(lop));
        salary.getDeductions().setPfTax(String.valueOf(tax));
        salary.getDeductions().setIncomeTax(String.valueOf(itax));
        salary.getDeductions().setTotalTax(String.valueOf(ttax));
        salary.getDeductions().setTotalDeductions(String.valueOf(tded));
        salary.setNetSalary(String.valueOf(net));
        payslipEntity.setSalary(salary);
        payslipEntity.setType(Constants.PAYSLIP);


        return payslipEntity;
    }

    public static PayslipEntity maskEmployeePayslip(PayslipEntity payslipRequest, SalaryEntity salaryRequest, AttendanceEntity attendance) {
        String var = null, fix = null, bas = null, gross = null;
        String hra = null, trav = null, pfc = null, other = null, spa = null;
        String te = null, pfE = null, pfEmployer = null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;

        if (payslipRequest.getSalary().getFixedAmount() != null) {
            fix = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getFixedAmount()).toString().getBytes());

        }
        if (payslipRequest.getSalary().getVariableAmount() != null) {
            var = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getVariableAmount()).toString().getBytes());

        }

        if (payslipRequest.getSalary().getGrossAmount() != null) { //annual
          gross  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getGrossAmount()).getBytes());
        }
        if (payslipRequest.getSalary().getBasicSalary() != null) { //annual
            bas  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getBasicSalary()).getBytes());
        }
        if (payslipRequest.getSalary().getAllowances().getTravelAllowance() != null) { //annual
            trav  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getAllowances().getTravelAllowance()).getBytes());
        }
        if (payslipRequest.getSalary().getAllowances().getPfContributionEmployee() != null) { //annual
            pfc  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getAllowances().getPfContributionEmployee()).getBytes());
        }
        if (payslipRequest.getSalary().getAllowances().getHra() != null) { //annual
            hra  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getAllowances().getHra()).getBytes());
        }
        if (payslipRequest.getSalary().getAllowances().getSpecialAllowance() != null) { //annual
            spa  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getAllowances().getSpecialAllowance()).getBytes());
        }
        if (payslipRequest.getSalary().getAllowances().getOtherAllowances() != null) { //annual
            other  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getAllowances().getOtherAllowances()).getBytes());
        }
        if (payslipRequest.getSalary().getTotalEarnings() != null) { //annual
            te  =Base64.getEncoder().encodeToString((payslipRequest.getSalary().getTotalEarnings()).getBytes());
        }

        if (payslipRequest.getSalary().getDeductions().getPfEmployee() != null) { //annual
            pfE  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getPfEmployee()).getBytes());
        }
        if (payslipRequest.getSalary().getDeductions().getPfEmployer() != null) { //annual
            pfEmployer  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getPfEmployer()).getBytes());
        }
        if (payslipRequest.getSalary().getDeductions().getLop() != null) { //annual
            lop  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getLop()).getBytes());
        }
        if (payslipRequest.getSalary().getDeductions().getTotalDeductions() != null) { //annual
            tded  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getTotalDeductions()).getBytes());
        }
        if (payslipRequest.getSalary().getDeductions().getPfTax() != null) { //annual
            tax  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getPfTax()).getBytes());
        }
        if (payslipRequest.getSalary().getDeductions().getIncomeTax() != null) { //annual
            itax  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getIncomeTax()).getBytes());
        }
        if (payslipRequest.getSalary().getDeductions().getTotalTax() != null) { //annual
            ttax  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getDeductions().getTotalTax()).getBytes());
        }
        if (payslipRequest.getSalary().getNetSalary() != null) { //annual
            net  = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getNetSalary()).getBytes());
        }


        ObjectMapper objectMapper = new ObjectMapper();
        AttendanceEntity attendanceEntity = objectMapper.convertValue(attendance,AttendanceEntity.class);
        attendanceEntity.setMonth(attendance.getMonth());
        attendanceEntity.setYear(attendance.getYear());
        attendanceEntity.setTotalWorkingDays(attendance.getTotalWorkingDays());
        attendanceEntity.setNoOfWorkingDays(attendance.getNoOfWorkingDays());

        PayslipEntity payslipEntity = objectMapper.convertValue(payslipRequest, PayslipEntity.class);
        SalaryEntity salary = objectMapper.convertValue(salaryRequest,SalaryEntity.class);
        salary.setFixedAmount(String.valueOf(fix));
        salary.setGrossAmount(String.valueOf(gross));
        salary.setVariableAmount(String.valueOf(var));
        salary.setBasicSalary(String.valueOf(bas));
        salary.getAllowances().setSpecialAllowance(String.valueOf(spa));
        salary.getAllowances().setOtherAllowances(String.valueOf(other));
        salary.getAllowances().setTravelAllowance(String.valueOf(trav));
        salary.getAllowances().setHra(String.valueOf(hra));
        salary.getAllowances().setPfContributionEmployee(String.valueOf(pfc));
        salary.setTotalEarnings(String.valueOf(te));
        salary.getDeductions().setPfEmployee(String.valueOf(pfE));
        salary.getDeductions().setPfEmployer(String.valueOf(pfEmployer));
        salary.getDeductions().setLop(String.valueOf(lop));
        salary.getDeductions().setPfTax(String.valueOf(tax));
        salary.getDeductions().setIncomeTax(String.valueOf(itax));
        salary.getDeductions().setTotalTax(String.valueOf(ttax));
        salary.getDeductions().setTotalDeductions(String.valueOf(tded));
        salary.setNetSalary(String.valueOf(net));
        payslipEntity.setSalary(salary);
        payslipEntity.setAttendance(attendanceEntity);
        payslipEntity.setType(Constants.PAYSLIP);


        return payslipEntity;
    }

    public static PayslipEntity unmaskEmployeePayslip(PayslipEntity payslipRequest) {

        String var = null, fix = null, bas = null, gross = null;
        String hra = null, trav = null, pfc = null, other = null,spa=null;
        String te= null, pfE = null, pfEmployer =null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;
        if(payslipRequest.getSalary().getFixedAmount() != null) {
            fix = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getFixedAmount().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getVariableAmount() != null) {
            var = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getVariableAmount().toString().getBytes()));
        }
        if(payslipRequest.getSalary().getGrossAmount() != null) {
            gross = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getGrossAmount().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getBasicSalary() != null) {
            bas = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getBasicSalary().toString().getBytes())));
        }

        if(payslipRequest.getSalary().getAllowances().getTravelAllowance() != null) {
            trav = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getTravelAllowance().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getAllowances().getHra() != null) {
            hra =new String((Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getHra().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getAllowances().getOtherAllowances() != null) {
            other = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getOtherAllowances().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getAllowances().getSpecialAllowance() != null) {
            spa = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getSpecialAllowance().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getAllowances().getPfContributionEmployee() != null) {
            pfc = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getPfContributionEmployee().toString().getBytes())));
        }

        if(payslipRequest.getSalary().getTotalEarnings() != null) {
            te = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getTravelAllowance().toString().getBytes())));
        }

        if(payslipRequest.getSalary().getDeductions().getPfEmployee() != null) {
            pfE = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfEmployee().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getDeductions().getPfEmployer() != null) {
            pfEmployer = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfEmployer().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getDeductions().getLop() != null) {
            lop = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfEmployee().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getDeductions().getTotalDeductions() != null) {
            tded = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getTotalDeductions().toString().getBytes())));
        }
        if(payslipRequest.getSalary().getDeductions().getTotalDeductions() != null) {
            tded = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getTotalDeductions().toString().getBytes())));
        }

        if(payslipRequest.getSalary().getDeductions().getPfTax() != null) {
            tax = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfTax().toString().getBytes())));
        }
        Double grossAmount = Double.parseDouble(gross);
        Double totalDeductions = Double.valueOf(tded);
        itax = String.valueOf(TaxCalculatorUtils.getNewTax( grossAmount-totalDeductions));

        if(payslipRequest.getSalary().getDeductions().getTotalTax() != null) {
            ttax = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getTotalTax().toString().getBytes())));
        }

        if(payslipRequest.getSalary().getNetSalary() != null) {
            net = new String((Base64.getDecoder().decode(payslipRequest.getSalary().getNetSalary().toString().getBytes())));
        }


        ObjectMapper objectMapper = new ObjectMapper();

        PayslipEntity payslipEntity = objectMapper.convertValue(payslipRequest, PayslipEntity.class);
        payslipRequest.getSalary().setFixedAmount(fix);
        payslipRequest.getSalary().setGrossAmount(gross);
        payslipRequest.getSalary().setVariableAmount(var);
        payslipRequest.getSalary().setBasicSalary(bas);
        payslipRequest.getSalary().getAllowances().setSpecialAllowance(spa);
        payslipRequest.getSalary().getAllowances().setOtherAllowances(other);
        payslipRequest.getSalary().getAllowances().setTravelAllowance(trav);
        payslipRequest.getSalary().getAllowances().setHra(hra);
        payslipRequest.getSalary().getAllowances().setPfContributionEmployee(pfc);
        payslipRequest.getSalary().setTotalEarnings(te);
        payslipRequest.getSalary().getDeductions().setPfEmployee(pfE);
        payslipRequest.getSalary().getDeductions().setPfEmployer(pfEmployer);
        payslipRequest.getSalary().getDeductions().setLop(lop);
        payslipRequest.getSalary().getDeductions().setPfTax(tax);
        payslipRequest.getSalary().getDeductions().setIncomeTax(itax);
        payslipRequest.getSalary().getDeductions().setTotalTax(ttax);
        payslipRequest.getSalary().getDeductions().setTotalDeductions(tded);
        payslipRequest.getSalary().setNetSalary(net);
        payslipEntity.setType(Constants.PAYSLIP);


        return payslipEntity;
    }



}
