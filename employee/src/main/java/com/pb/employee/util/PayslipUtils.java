package com.pb.employee.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.persistance.model.AttendanceEntity;
import com.pb.employee.persistance.model.PayslipEntity;
import com.pb.employee.persistance.model.SalaryEntity;
import com.pb.employee.request.PayslipRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.Base64;
import java.util.List;

@Component
@Service
@Slf4j
public class PayslipUtils {

    public static PayslipEntity unMaskEmployeePayslipProperties(SalaryEntity salaryRequest, PayslipRequest payslipRequest, String id, String employeeId, AttendanceEntity attendanceEntity) {
        Double var = null, fix = null, bas = null, gross = null;
        Double hra = null, trav = null, pfc = null, other = null, spa = null;
        Double te = null, pfE = null, pfEmployer = null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;
        int totalWorkingDays = 0, noOfWorkingDays=0;

        ObjectMapper objectMapper = new ObjectMapper();

        AttendanceEntity attendance = objectMapper.convertValue(attendanceEntity,AttendanceEntity.class);
        SalaryEntity salary = objectMapper.convertValue(salaryRequest,SalaryEntity.class);

        if (attendance.getNoOfWorkingDays() !=null){
            byte[] decodedFix = Base64.getDecoder().decode(attendance.getNoOfWorkingDays());
            noOfWorkingDays= Integer.parseInt(new String(decodedFix));
            attendance.setNoOfWorkingDays(String.valueOf(noOfWorkingDays));
        }
        if (attendance.getTotalWorkingDays() !=null){
            byte[] decodedFix = Base64.getDecoder().decode(attendance.getTotalWorkingDays());
            totalWorkingDays= Integer.parseInt(new String(decodedFix));
            attendance.setTotalWorkingDays(String.valueOf(totalWorkingDays));
        }
        if (salaryRequest.getVariableAmount() != null) {
            byte[] decodedVar = Base64.getDecoder().decode(salaryRequest.getVariableAmount());
            var = Double.parseDouble(new String(decodedVar));
            salary.setVariableAmount(String.valueOf(var));
        }
        if (salaryRequest.getBasicSalary() != null) { // monthly
            byte[] decodedBas = Base64.getDecoder().decode(salaryRequest.getBasicSalary());
            bas = Double.parseDouble(new String(decodedBas));
        }

        if (salaryRequest.getFixedAmount() != null) {
            byte[] decodedFix = Base64.getDecoder().decode(salaryRequest.getFixedAmount());
            fix = Double.parseDouble(new String(decodedFix));
            salary.setFixedAmount(String.valueOf(fix));

        }

        if (salaryRequest.getGrossAmount() != null) { //annual
            byte[] decodedGross = Base64.getDecoder().decode(salaryRequest.getGrossAmount());
            gross = Double.parseDouble(new String(decodedGross));
            salary.setGrossAmount(String.valueOf(gross));
        }


        if (salaryRequest.getAllowances().getTravelAllowance() != null) {
            byte[] decodedTrav = Base64.getDecoder().decode(salaryRequest.getAllowances().getTravelAllowance());
            trav= Double.parseDouble(new String(decodedTrav));
            trav =  trav/12.0;
            salary.getAllowances().setTravelAllowance(String.valueOf(trav));
        }
        if (salary.getDeductions().getPfEmployee() != null) {
            byte[] decodedPfEmployee = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployee());
            byte[] decodedPfEmployer = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployer());
            pfc = Double.parseDouble(new String(decodedPfEmployee)) + Double.parseDouble(new String(decodedPfEmployer));
            pfc = pfc/12.0;
            salary.getAllowances().setPfContributionEmployee(String.valueOf(pfc));
        }
        if (salaryRequest.getAllowances().getHra() != null) {
            byte[] decodedHra = Base64.getDecoder().decode(salaryRequest.getAllowances().getHra());
            hra = Double.parseDouble(new String(decodedHra));
            hra = ((gross/12.0)*(hra/100));
            salary.getAllowances().setHra(String.valueOf(hra));
        }
        if (salaryRequest.getAllowances().getSpecialAllowance() != null) {
            byte[] decodedSpa = Base64.getDecoder().decode(salaryRequest.getAllowances().getSpecialAllowance());
            spa = Double.parseDouble(new String(decodedSpa));
            spa = spa/12.0;
            salary.getAllowances().setSpecialAllowance(String.valueOf(spa));
        }
        if (salaryRequest.getAllowances().getOtherAllowances() != null) {
            byte[] decodedOther = Base64.getDecoder().decode(salaryRequest.getAllowances().getOtherAllowances());
            other = Double.parseDouble(new String(decodedOther));
            other = other/12.0;
            salary.getAllowances().setOtherAllowances(String.valueOf(other));
        }
        bas = ((gross/12.0)-(other+spa+hra+pfc+trav));
        if (bas!=null)
            salary.setBasicSalary(String.valueOf(bas));

        if (salaryRequest.getTotalEarnings() != null) {
            te = bas+other+spa+hra+pfc+trav;
            salary.setTotalEarnings(String.valueOf(te));
        }

        if (salaryRequest.getDeductions().getPfEmployee() != null) {
            byte[] decodedPfE = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployee());
            pfE = Double.parseDouble(new String(decodedPfE));
            pfE = pfE/12.0;
            salary.getDeductions().setPfEmployee(String.valueOf(pfE));
        }
        if (salaryRequest.getDeductions().getPfEmployer() != null) {
            byte[] decodedPfEmployer = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfEmployer());
            pfEmployer = Double.parseDouble(new String(decodedPfEmployer));
            pfEmployer = pfEmployer/12.0;
            salary.getDeductions().setPfEmployer(String.valueOf(pfEmployer));
        }
        if (salaryRequest.getDeductions().getLop() != null) {

            int noOfLeaves = totalWorkingDays - noOfWorkingDays;
            if (noOfLeaves > 1) {
                double monthlySalary = (gross / 12.0);
                double perDaySalary = monthlySalary / totalWorkingDays;
                lop = (noOfLeaves - 1) * perDaySalary;
                salary.getDeductions().setLop(String.valueOf(lop));
            }
        }
        if (salaryRequest.getDeductions().getTotalDeductions() != null) {
            if (lop != null) {
                tded = lop + pfEmployer + pfE;
            }else {
                tded=pfEmployer+pfE;
            }
            salary.getDeductions().setTotalDeductions(String.valueOf(tded));
        }

        if (salaryRequest.getDeductions().getPfTax() != null) {
            byte[] decodedTax = Base64.getDecoder().decode(salaryRequest.getDeductions().getPfTax());
            tax = Double.parseDouble(new String(decodedTax));
            tax = tax/12.0;
            salary.getDeductions().setPfTax(String.valueOf(tax));
        }
        if (salaryRequest.getDeductions().getIncomeTax() != null) {
            byte[] decodedItax = Base64.getDecoder().decode(salaryRequest.getDeductions().getIncomeTax());
            itax = Double.parseDouble(new String(decodedItax));
            itax = itax/12.0;
            salary.getDeductions().setIncomeTax(String.valueOf(itax));

        }
        if (salaryRequest.getDeductions().getTotalTax() != null) {
            byte[] decodedTtax = Base64.getDecoder().decode(salaryRequest.getDeductions().getTotalTax());
            ttax = Double.parseDouble(new String(decodedTtax));
            ttax = tax + itax;

            salary.getDeductions().setTotalTax(String.valueOf(ttax));
        }

        if (salaryRequest.getNetSalary() != null) {
            net = te-tded-ttax;
            salary.setNetSalary(String.valueOf(net));

        }


        PayslipEntity payslipEntity = objectMapper.convertValue(payslipRequest, PayslipEntity.class);

        payslipEntity.setPayslipId(id);
        payslipEntity.setAttendanceId(attendance.getAttendanceId());
        payslipEntity.setMonth(payslipRequest.getMonth());
        payslipEntity.setYear(payslipRequest.getYear());
        payslipEntity.setEmployeeId(employeeId);
        payslipEntity.setSalaryId(salaryRequest.getSalaryId());

        payslipEntity.setSalary(salary);
        payslipEntity.setAttendance(attendance);
        payslipEntity.setType(Constants.PAYSLIP);


        return payslipEntity;
    }

    public static PayslipEntity maskEmployeePayslip(PayslipEntity payslipRequest, SalaryEntity salaryRequest, AttendanceEntity attendance) {
        String var = null, fix = null, bas = null, gross = null;
        String hra = null, trav = null, pfc = null, other = null, spa = null;
        String te = null, pfE = null, pfEmployer = null, lop = null, tax = null, itax = null, ttax = null, tded = null, net = null;

        if (payslipRequest.getSalary().getFixedAmount() != null) {
            fix = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getFixedAmount()).getBytes());

        }
        if (payslipRequest.getSalary().getVariableAmount() != null) {
            var = Base64.getEncoder().encodeToString((payslipRequest.getSalary().getVariableAmount()).getBytes());
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

        String var = null, fix = null, bas = null, gross = null,
                hra = null, trav = null, pfc = null, other = null,spa=null,
                te= null, pfE = null, pfEmployer =null, lop = null, tax = null,
                itax = null, ttax = null, tded = null, net = null,noOfWorkingDays=null,totalWorkingDays=null;
        if (payslipRequest.getSalary().getFixedAmount() != null) {
            fix = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getFixedAmount()));
        }
        if (payslipRequest.getSalary().getVariableAmount() != null) {
            var = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getVariableAmount()));
        }
        if (payslipRequest.getSalary().getGrossAmount() != null) {
            gross = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getGrossAmount()));
        }
        if (payslipRequest.getSalary().getBasicSalary() != null) {
            bas = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getBasicSalary()));
        }
        if (payslipRequest.getSalary().getAllowances().getTravelAllowance() != null) {
            trav = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getTravelAllowance()));
        }
        if (payslipRequest.getSalary().getAllowances().getHra() != null) {
            hra = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getHra()));
        }
        if (payslipRequest.getSalary().getAllowances().getOtherAllowances() != null) {
            other = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getOtherAllowances()));
        }
        if (payslipRequest.getSalary().getAllowances().getSpecialAllowance() != null) {
            spa = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getSpecialAllowance()));
        }
        if (payslipRequest.getSalary().getAllowances().getPfContributionEmployee() != null) {
            pfc = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getAllowances().getPfContributionEmployee()));
        }
        if (payslipRequest.getSalary().getTotalEarnings() != null) {
            te = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getTotalEarnings()));
        }
        if (payslipRequest.getSalary().getDeductions().getPfEmployee() != null) {
            pfE = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfEmployee()));
        }
        if (payslipRequest.getSalary().getDeductions().getPfEmployer() != null) {
            pfEmployer = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfEmployer()));
        }
        if (payslipRequest.getSalary().getDeductions().getLop() != null) {
            lop = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getLop()));
        }
        if (payslipRequest.getSalary().getDeductions().getTotalDeductions() != null) {
            tded = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getTotalDeductions()));
        }
        if (payslipRequest.getSalary().getDeductions().getPfTax() != null) {
            tax = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getPfTax()));
        }
        if (payslipRequest.getAttendance().getNoOfWorkingDays()!= null) {
            noOfWorkingDays = new String(Base64.getDecoder().decode(payslipRequest.getAttendance().getNoOfWorkingDays()));
        }
        if (payslipRequest.getAttendance().getTotalWorkingDays()!= null) {
            totalWorkingDays = new String(Base64.getDecoder().decode(payslipRequest.getAttendance().getTotalWorkingDays()));
        }
        if (payslipRequest.getSalary().getDeductions().getIncomeTax() != null) {
            itax = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getIncomeTax()));
        }
        if (payslipRequest.getSalary().getDeductions().getTotalTax() != null) {
            ttax = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getDeductions().getTotalTax()));
        }
        if (payslipRequest.getSalary().getNetSalary() != null) {
            net = new String(Base64.getDecoder().decode(payslipRequest.getSalary().getNetSalary()));
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
        String inWords =  numberToWords(Double.valueOf(net));
        payslipRequest.setInWords(inWords + " Rupees Only.");
        payslipRequest.getAttendance().setNoOfWorkingDays(noOfWorkingDays);
        payslipRequest.getAttendance().setTotalWorkingDays(totalWorkingDays);
        payslipEntity.setType(Constants.PAYSLIP);


        return payslipEntity;
    }


    static String[] singleDigit = {"", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"};
    static String[] doubleDigit = {"Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"};
    static String[] belowHundred = {"Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"};


    private static String numberToWords(Double n) {
        double num = n; // Convert Double to double
        if (num < 0) {
            return "Minus " + numberToWords(-num);
        }
        if (num == 0) {
            return "Zero";
        }

        // Recursive function to translate the number into words
        StringBuilder word = new StringBuilder();
        word.append(translate((int) num));

        // Get the result by translating the given number
        return word.toString().trim() ;
    }

    // Translate method to convert the number into words
    private static String translate(int n) {
        StringBuilder word = new StringBuilder();

        if (n < 10) {
            word.append(singleDigit[n]).append(' ');
        } else if (n < 20) {
            word.append(doubleDigit[n - 10]).append(' ');
        } else if (n < 100) {
            String rem = translate(n % 10);
            word.append(belowHundred[(n - n % 10) / 10 - 2]).append(' ').append(rem);
        } else if (n < 1000) {
            word.append(singleDigit[n / 100]).append(" Hundred ").append(translate(n % 100));
        } else if (n < 1000000) {
            word.append(translate(n / 1000)).append(" Thousand ").append(translate(n % 1000));
        } else if (n < 1000000000) {
            word.append(translate(n / 1000000)).append(" Million ").append(translate(n % 1000000));
        } else {
            word.append(translate(n / 1000000000)).append(" Billion ").append(translate(n % 1000000000));
        }

        return word.toString();
    }


    public static void formatNumericalFields(PayslipEntity payslipProperties) {
        if (payslipProperties.getSalary() != null) {
            payslipProperties.getSalary().setFixedAmount(formatValue(payslipProperties.getSalary().getFixedAmount()));
            payslipProperties.getSalary().setBasicSalary(formatValue(payslipProperties.getSalary().getBasicSalary()));
            payslipProperties.getSalary().setNetSalary(formatValue(payslipProperties.getSalary().getNetSalary()));
            payslipProperties.getSalary().setGrossAmount(formatValue(payslipProperties.getSalary().getGrossAmount()));
            payslipProperties.getSalary().setTotalEarnings(formatValue(payslipProperties.getSalary().getTotalEarnings()));
            payslipProperties.getSalary().setVariableAmount(formatValue(payslipProperties.getSalary().getVariableAmount()));

            if (payslipProperties.getSalary().getAllowances() != null) {
                payslipProperties.getSalary().getAllowances().setHra(formatValue(payslipProperties.getSalary().getAllowances().getHra()));
                payslipProperties.getSalary().getAllowances().setOtherAllowances(formatValue(payslipProperties.getSalary().getAllowances().getOtherAllowances()));
                payslipProperties.getSalary().getAllowances().setTravelAllowance(formatValue(payslipProperties.getSalary().getAllowances().getTravelAllowance()));
                payslipProperties.getSalary().getAllowances().setSpecialAllowance(formatValue(payslipProperties.getSalary().getAllowances().getSpecialAllowance()));
                payslipProperties.getSalary().getAllowances().setPfContributionEmployee(formatValue(payslipProperties.getSalary().getAllowances().getPfContributionEmployee()));
            }

            if (payslipProperties.getSalary().getDeductions() != null) {
                payslipProperties.getSalary().getDeductions().setTotalDeductions(formatValue(payslipProperties.getSalary().getDeductions().getTotalDeductions()));
                payslipProperties.getSalary().getDeductions().setLop(formatValue(payslipProperties.getSalary().getDeductions().getLop()));
                payslipProperties.getSalary().getDeductions().setIncomeTax(formatValue(payslipProperties.getSalary().getDeductions().getIncomeTax()));
                payslipProperties.getSalary().getDeductions().setPfTax(formatValue(payslipProperties.getSalary().getDeductions().getPfTax()));
                payslipProperties.getSalary().getDeductions().setPfEmployer(formatValue(payslipProperties.getSalary().getDeductions().getPfEmployer()));
                payslipProperties.getSalary().getDeductions().setPfEmployee(formatValue(payslipProperties.getSalary().getDeductions().getPfEmployee()));
                payslipProperties.getSalary().getDeductions().setTotalTax(formatValue(payslipProperties.getSalary().getDeductions().getTotalTax()));
            }
        }
    }

    private static String formatValue(String value) {
        if (value == null || value.isEmpty()) {
            return value;
        }
        try {
            // Parse the value to integer and then format it
            double doubleValue = Double.parseDouble(value);
            long longValue = (long) doubleValue; // Extract the integer part

            return String.valueOf(longValue);
        } catch (NumberFormatException e) {
            // Handle the exception as needed
            e.printStackTrace();
            return value; // Return original value in case of error
        }
    }


}