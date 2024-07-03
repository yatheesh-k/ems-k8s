package com.pb.employee.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.persistance.model.PayslipEntity;
import com.pb.employee.persistance.model.SalaryEntity;
import com.pb.employee.request.PayslipRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.awt.desktop.AppForegroundEvent;
import java.util.Base64;

@Component
@Service
@Slf4j
public class PayslipUtils {

    public static PayslipEntity maskEmployeePayslipProperties(SalaryEntity salaryRequest, PayslipRequest payslipRequest, String id, String salaryId, String employeeId) {
        Double var = null, fix = null, bas = null, gross = null;
        Double hra = null, trav = null, pfc = null, other = null, spa = null;
        Double te = null, pfE = null, pfEmployer = null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;

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
        if (salaryRequest.getAllowances().getPfContributionEmployee() != null) {
            byte[] decodedPfc = Base64.getDecoder().decode(salaryRequest.getAllowances().getPfContributionEmployee());
             pfc = Double.parseDouble(new String(decodedPfc));
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
            byte[] decodedLop = Base64.getDecoder().decode(salaryRequest.getDeductions().getLop());
            lop = Double.parseDouble(new String(decodedLop));
            lop= lop/12.0;
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
        payslipEntity.setMonth(payslipRequest.getMonth());
        payslipEntity.setYear(payslipRequest.getYear());
        payslipEntity.setSalaryId(salaryId);
        payslipEntity.setEmployeeId(employeeId);

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

}
