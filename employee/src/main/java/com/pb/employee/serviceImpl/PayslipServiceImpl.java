package com.pb.employee.serviceImpl;

import com.itextpdf.text.DocumentException;
import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.EmployeeStatus;
import com.pb.employee.request.PayslipRequest;
import com.pb.employee.service.PayslipService;
import com.pb.employee.util.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.*;
import java.util.*;

@Service
@Slf4j
public class PayslipServiceImpl implements PayslipService {

    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Override
    public ResponseEntity<?> generatePaySlip(PayslipRequest payslipRequest, String salaryId, String employeeId) throws EmployeeException, IOException {
        String paySlipId = ResourceIdUtils.generatePayslipId(payslipRequest.getMonth(), payslipRequest.getYear(), employeeId);
        SalaryEntity entity = null;
        Object payslipEntity = null;
        EmployeeEntity employee = null;
        AttendanceEntity attendance = null;
        String index = ResourceIdUtils.generateCompanyIndex(payslipRequest.getCompanyName());
            try{
                payslipEntity = openSearchOperations.getById(paySlipId, null, index);
                if(payslipEntity != null) {
                    log.error("employee details existed{}", payslipRequest.getCompanyName());
                    throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_PAYSLIP_ALREADY_EXISTS),employeeId),
                            HttpStatus.CONFLICT);
                }
                String attendanceId = ResourceIdUtils.generateAttendanceId(payslipRequest.getCompanyName(), employeeId, payslipRequest.getYear(),payslipRequest.getMonth());

                attendance = openSearchOperations.getAttendanceById(attendanceId, null, index);
                if (attendance == null){
                    log.error("Employee Attendance is not found fot {} employee", employeeId);
                    throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_GET_ATTENDANCE),
                            HttpStatus.INTERNAL_SERVER_ERROR);
                }
            } catch (IOException e) {
                log.error("Unable to get the company details {}", payslipRequest.getCompanyName());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_EMPLOYEE),employeeId),
                        HttpStatus.BAD_REQUEST);
            }
            employee = openSearchOperations.getEmployeeById(employeeId, null, index);
            if(employee ==null){
                log.error("Employee with this {}, is not found", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            entity = openSearchOperations.getSalaryById(salaryId, null, index);
            if (entity==null){
                log.error("Exception while fetching employee for salary {}", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!entity.getEmployeeId().equals(employeeId)) {
                log.error("Employee ID mismatch for salary {}: expected {}, found", salaryId, employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_NOT_MATCHING),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (entity.getStatus().equals(EmployeeStatus.INACTIVE.getStatus())){
                log.error("Employee{} Salary {}: is inActive", salaryId, employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.SALARY_INACTIVE),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        try {
            // Retrieve attendance details
            String attendanceId = ResourceIdUtils.generateAttendanceId(payslipRequest.getCompanyName(),employeeId,payslipRequest.getYear(),payslipRequest.getMonth());
            attendance=openSearchOperations.getAttendanceById(attendanceId,null,index);
            PayslipEntity payslipProperties = PayslipUtils.unMaskEmployeePayslipProperties(entity, payslipRequest, paySlipId, employeeId, attendance);
            PayslipUtils.formatNumericalFields(payslipProperties);
            payslipProperties = PayslipUtils.maskEmployeePayslip(payslipProperties,entity,attendance);
            Entity result = openSearchOperations.saveEntity(payslipProperties, paySlipId, index);
        } catch (Exception exception) {
            log.error("Unable to save the employee details  {}",exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_GENERATE_PAYSLIP),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);
    }


    @Override
    public ResponseEntity<?> generatePaySlipForAllEmployees(PayslipRequest payslipRequest) throws EmployeeException, IOException {
        String index = ResourceIdUtils.generateCompanyIndex(payslipRequest.getCompanyName());
        AttendanceEntity attendanceEntities = null;
        List<PayslipEntity> generatedPayslips = new ArrayList<>();
        List<String> employeesWithoutAttendance = new ArrayList<>();

        try {
            List<EmployeeEntity> employeeEntities = openSearchOperations.getCompanyEmployees(payslipRequest.getCompanyName());

            for (EmployeeEntity employee : employeeEntities) {
                List<SalaryEntity> salaryEntities = openSearchOperations.getSalaries(payslipRequest.getCompanyName(), employee.getId());
                if (salaryEntities == null ) {
                    log.error("Employee Salary with employeeId {} is not found", employee.getId());
                    throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                            HttpStatus.INTERNAL_SERVER_ERROR);
                }

                String attendanceId = ResourceIdUtils.generateAttendanceId(payslipRequest.getCompanyName(), employee.getId(), payslipRequest.getYear(), payslipRequest.getMonth());

                attendanceEntities = openSearchOperations.getAttendanceById(attendanceId, null, index);
                if (attendanceEntities == null) {
                    log.error("Employee Attendance is not found for employee {}", employee.getId());
                    employeesWithoutAttendance.add(employee.getId());
                    continue; // Skip to the next employee if attendance is not found
                }

                // Generate payslip ID based on month, year, and employee ID
                String paySlipId = ResourceIdUtils.generatePayslipId(payslipRequest.getMonth(), payslipRequest.getYear(), employee.getEmployeeId());

                // Check if payslip already exists for this employee
                PayslipEntity payslipEntity = openSearchOperations.getPayslipById(paySlipId, null, index);
                if (payslipEntity != null) {
                    log.error("Payslip already exists for employee with ID {}", employee.getEmployeeId());
                    continue; // Skip to the next employee if payslip already exists
                }

                // Generate and save payslip for the current employee
                List<PayslipEntity> payslipPropertiesList = new ArrayList<>();
                for (SalaryEntity salary : salaryEntities) {
                    if (salary.getStatus().equals(EmployeeStatus.ACTIVE.getStatus())){
                        PayslipEntity payslipProperties = PayslipUtils.unMaskEmployeePayslipProperties(salary, payslipRequest, paySlipId, employee.getId(), attendanceEntities);
                        PayslipUtils.formatNumericalFields(payslipProperties);
                        payslipProperties = PayslipUtils.maskEmployeePayslip(payslipProperties, salary, attendanceEntities);
                        generatedPayslips.add(payslipProperties);
                        payslipPropertiesList.add(payslipProperties);
                   }
                }

                // Save all payslips for the current employee
                for (PayslipEntity payslipProperties : payslipPropertiesList) {
                    openSearchOperations.saveEntity(payslipProperties, paySlipId, index);
                }
            }

            // Return response with generated payslips and employees without attendance

        } catch (IOException | EmployeeException ex) {
            log.error("Error generating payslips: {}", ex.getMessage());
            throw ex; // Re-throw the caught exception for higher level handling

        } catch (Exception ex) {
            log.error("Unexpected error generating payslips: {}", ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_SAVE_EMPLOYEE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put(Constants.GENERATE_PAYSLIP, generatedPayslips);
        responseBody.put(Constants.EMPLOYEE_WITHOUT_ATTENDANCE, employeesWithoutAttendance);
        if (generatedPayslips.size() == 0){
            log.error("attendance are not found for the employees {}", employeesWithoutAttendance);
            throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_GET_ATTENDANCE), employeesWithoutAttendance),
                    HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(responseBody), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<?> getPayslipById(String companyName, String employeeId, String payslipId) throws EmployeeException, IOException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        EmployeeEntity employee = null;
        PayslipEntity entity = null;
        try {
           employee = openSearchOperations.getEmployeeById(employeeId, null, index);
           if (employee == null){
               log.error("Employee with this {}, is not found", employeeId);
               throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                       HttpStatus.INTERNAL_SERVER_ERROR);
           }
           entity=openSearchOperations.getPayslipById(payslipId, null, index);
           PayslipUtils.unmaskEmployeePayslip(entity);

            if (entity==null){
               log.error("Employee with this payslip {}, is not found", payslipId);
               throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_PAYSLIP),
                       HttpStatus.INTERNAL_SERVER_ERROR);
           }
           if (!entity.getEmployeeId().equals(employeeId)){
               log.error("Employee ID mismatch for payslipId {}: expected {}, found {}", payslipId, employeeId, entity.getEmployeeId());
               throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_NOT_MATCHING),
                       HttpStatus.INTERNAL_SERVER_ERROR);
           }
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
    public ResponseEntity<?> getEmployeePayslips(String companyName, String employeeId,String month,String year) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        EmployeeEntity employee = null;
        Object salary = null;
        List<PayslipEntity> allPayslips =null;
        try {
            // Fetch employee details
            employee = openSearchOperations.getEmployeeById(employeeId, null, index);
            if (employee == null) {
                log.error("Employee with ID {}  not found", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.NOT_FOUND);
            }
            allPayslips = openSearchOperations.getEmployeePayslip(companyName, employeeId,month,year);
            for (PayslipEntity payslipEntity:allPayslips){
                PayslipUtils.unmaskEmployeePayslip(payslipEntity);
            }

            if (allPayslips.isEmpty()) {
                log.warn("No matching payslips found for employee with ID {}", employee);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_NOT_MATCHING),
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            log.error("Exception while fetching payslips for employee {}: {}", employeeId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_PAYSLIP),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(allPayslips), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> getAllEmployeesPayslips(String companyName,String month,String year) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        EmployeeEntity employee = null;
        Object salary = null;
        List<PayslipEntity> allPayslips =null;
        try {
            // Fetch employee details
            allPayslips = openSearchOperations.getAllPayslips(companyName,month,year);
            for (PayslipEntity payslipEntity:allPayslips){
                PayslipUtils.unmaskEmployeePayslip(payslipEntity);
            }

            if (allPayslips.isEmpty()) {
                log.warn("No matching payslips found for employee with ID {}", employee);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPLOYEE_NOT_MATCHING),
                        HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            log.error("Exception while fetching payslips {}", ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_PAYSLIP),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(allPayslips), HttpStatus.OK);
    }


    @Override
    public ResponseEntity<?> deleteEmployeePayslipById(String companyName, String employeeId,String payslipId) throws EmployeeException{
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        EmployeeEntity employee = null;
        Object entity = null;
        try {
            employee = openSearchOperations.getEmployeeById(employeeId, null, index);
            if (employee == null){
                log.error("Employee with this {}, is not found", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            entity=openSearchOperations.getById(payslipId, null, index);
            if (entity==null){
                log.error("Employee with this payslip {}, is not found", payslipId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_PAYSLIP),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }

            openSearchOperations.deleteEntity(payslipId, index);
        }
        catch (Exception ex) {
            log.error("Exception while deleting salaries for employees {}: {}", payslipId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_SALARY),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.DELETED), HttpStatus.OK);

    }


    public ResponseEntity<byte[]> downloadPayslip(String companyName, String payslipId, String employeeId, HttpServletRequest request) {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        EmployeeEntity employee;
        PayslipEntity entity;
        DepartmentEntity department;
        DesignationEntity designation;
        CompanyEntity company;

        try {
            SSLUtil.disableSSLVerification();
            employee = openSearchOperations.getEmployeeById(employeeId, null, index);
            if (employee == null) {
                log.error("Employee with this {}, is not found", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            department = openSearchOperations.getDepartmentById(employee.getDepartment(), null, index);
            designation = openSearchOperations.getDesignationById(employee.getDesignation(), null, index);
            company = openSearchOperations.getCompanyById(employee.getCompanyId(), null, Constants.INDEX_EMS);
            if (company == null) {
                log.error("Company {} is not found", employee.getCompanyId());
                throw new EmployeeException(String.format(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.COMPANY_ALREADY_EXISTS), companyName),
                        HttpStatus.CONFLICT);
            }
            entity = openSearchOperations.getPayslipById(payslipId, null, index);
            PayslipUtils.unmaskEmployeePayslip(entity);
            Entity companyEntity = CompanyUtils.unmaskCompanyProperties(company, request);
            Entity employeeEntity = EmployeeUtils.unmaskEmployeeProperties(employee, department, designation);
            String htmlContent = generatePayslipHtml(entity, (EmployeeEntity) employeeEntity, company, request);

            // Convert HTML to PDF
            byte[] pdfBytes = generatePdfFromHtml(htmlContent);

            // Set HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("payslip_" + employee.getFirstName() + ".pdf")
                    .build());

            // Return response
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (IOException e) {
            // Handle the error
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (EmployeeException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public byte[] generatePdfFromHtml(String html) throws IOException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(baos);
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new IOException(e.getMessage());
        }
    }

    private String generatePayslipHtml(PayslipEntity payslipEntity, EmployeeEntity employee, CompanyEntity company, HttpServletRequest request) {
        StringBuilder htmlBuilder = new StringBuilder();


        htmlBuilder.append("<!DOCTYPE html>");
        htmlBuilder.append("<html lang=\"en\">");
        htmlBuilder.append("<head>");
        htmlBuilder.append("<meta charset=\"UTF-8\"/>");
        htmlBuilder.append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>");
        htmlBuilder.append("<title>Pay Slip</title>");

        htmlBuilder.append("<style>");
        htmlBuilder.append("@page {");
        htmlBuilder.append("  size: A4;");
        htmlBuilder.append("  margin: 6mm;");
        htmlBuilder.append("}");
        htmlBuilder.append("body {");
        htmlBuilder.append("  margin: 0;");
        htmlBuilder.append("  padding: 0;");
        htmlBuilder.append("}");
        htmlBuilder.append(".main {");
        htmlBuilder.append("  width: 100%;");
        htmlBuilder.append("  box-sizing: border-box;");
        htmlBuilder.append("}");
        htmlBuilder.append(".pdfPage {");
        htmlBuilder.append("  width: 100%;");
        htmlBuilder.append("  margin: 0 auto;");
        htmlBuilder.append("  box-sizing: border-box;");
        htmlBuilder.append("}");
        htmlBuilder.append(".top { display: flex;flex-wrap: wrap; justify-content: space-around; margin-bottom: 20px; }");
        htmlBuilder.append(".date-info { text-align: left; flex: 1; }");
        htmlBuilder.append(".logo { text-align: end; flex-shrink: 0;margin-bottom:20px; margin-top:0px;margin-left:500px}");
        htmlBuilder.append(".logo img {max-width: 120px; height: 80px; display: flex; }");
        htmlBuilder.append(".details {");
        htmlBuilder.append("  width: 100%;");
        htmlBuilder.append("  margin-bottom: 20px;");
        htmlBuilder.append("  border-collapse: collapse;");
        htmlBuilder.append("}");
        htmlBuilder.append(".details table {");
        htmlBuilder.append("  width: 100%;");
        htmlBuilder.append("  border-collapse: collapse;");
        htmlBuilder.append("}");
        htmlBuilder.append(".details th, .details td {");
        htmlBuilder.append("  border: 0.5px solid black;");
        htmlBuilder.append("  padding: 4px;");
        htmlBuilder.append("  text-align: left;");
        htmlBuilder.append("}");
        htmlBuilder.append(".employee-details {");
        htmlBuilder.append("  text-align: center;");
        htmlBuilder.append("}");
        htmlBuilder.append(".text {");
        htmlBuilder.append("  margin: 20px 0;");
        htmlBuilder.append("}");
        htmlBuilder.append(".address {");
        htmlBuilder.append("  margin-top: 220px;");
        htmlBuilder.append("  text-align: center;");
        htmlBuilder.append("}");
        htmlBuilder.append("</style>");

        htmlBuilder.append("</head>");
        htmlBuilder.append("<body>");
        htmlBuilder.append("<div class=\"main\">");
        htmlBuilder.append("<div class=\"pdfPage\">");

        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<td>");
        htmlBuilder.append("<div class=\"date-info\">");
        htmlBuilder.append("<h4 id=\"month-year\">").append(payslipEntity.getMonth()+" / "+payslipEntity.getYear()).append("</h4>");
        htmlBuilder.append("<h4 id=\"employee-name\">").append(employee.getFirstName()+" "+employee.getLastName()).append("</h4>");
        htmlBuilder.append("</div>");
        htmlBuilder.append("</td>");
        htmlBuilder.append("<td>");
        htmlBuilder.append("<div class=\"logo\">");
        htmlBuilder.append("<img src=\"").append(company.getImageFile()).append("\"/>");
        htmlBuilder.append("</div>");
        htmlBuilder.append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("</table>");

        htmlBuilder.append("<div class=\"details\">");
        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th colspan=\"4\" class=\"employee-details\">Employee Details</th>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>EmployeeId</th>");
        htmlBuilder.append("<td>").append(employee.getEmployeeId()).append("</td>");
        htmlBuilder.append("<th>Joining Date</th>");
        htmlBuilder.append("<td>").append(employee.getDateOfHiring()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Date Of Birth</th>");
        htmlBuilder.append("<td>").append(employee.getDateOfBirth()).append("</td>");
        htmlBuilder.append("<th>PAN</th>");
        htmlBuilder.append("<td>").append(employee.getPanNo()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Department</th>");
        htmlBuilder.append("<td>").append(employee.getDepartmentName()).append("</td>");
        htmlBuilder.append("<th>UAN</th>");
        htmlBuilder.append("<td>").append(employee.getUanNo()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Designation</th>");
        htmlBuilder.append("<td>").append(employee.getDesignationName()).append("</td>");
        htmlBuilder.append("<th>Location</th>");
        htmlBuilder.append("<td>").append(employee.getLocation()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<td colspan=\"4\" class=\"employee-details\">Bank ACC No: ").append(employee.getAccountNo()).append(" ;IFSC: ").append(employee.getIfscCode()).append(" ;Bank: ").append(employee.getBankName()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("</table>");
        htmlBuilder.append("</div>");

        htmlBuilder.append("<div class=\"details\">");
        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Total Working Days</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getAttendance().getTotalWorkingDays()).append("</td>");
        htmlBuilder.append("<th>No.Of Working Days</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getAttendance().getNoOfWorkingDays()).append("</td>");
        htmlBuilder.append("<th>No.Of Leaves</th>");
        try {
            int totalWorkingDays = Integer.parseInt(payslipEntity.getAttendance().getTotalWorkingDays());
            int noOfWorkingDays = Integer.parseInt(payslipEntity.getAttendance().getNoOfWorkingDays());
            int workingDays = totalWorkingDays - noOfWorkingDays;

            htmlBuilder.append("<td>").append(workingDays).append("</td>");
        } catch (NumberFormatException e) {
            log.error("Error parsing working days values: ", e);
            htmlBuilder.append("<td>N/A</td>"); // Default value or error indication
        }        htmlBuilder.append("</tr>");
        htmlBuilder.append("</table>");
        htmlBuilder.append("</div>");

        htmlBuilder.append("<div class=\"details\">");
        htmlBuilder.append("<table>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th class=\"earnings\">Earnings (A)</th>");
        htmlBuilder.append("<th class=\"earnings\">Amount</th>");
        htmlBuilder.append("<th class=\"deductions\">Deductions (B)</th>");
        htmlBuilder.append("<th class=\"deductions\">Amount</th>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Basic Salary</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getBasicSalary()).append("</td>");
        htmlBuilder.append("<th>PF Employee</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getPfEmployee()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>HRA</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getAllowances().getHra()).append("</td>");
        htmlBuilder.append("<th>PF Employer</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getPfEmployer()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");

        htmlBuilder.append("<th>Travel Allowance</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getAllowances().getTravelAllowance()).append("</td>");
        htmlBuilder.append("<th>LOP</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getLop()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>PF Contribution Employee</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getAllowances().getPfContributionEmployee()).append("</td>");
        htmlBuilder.append("<th>Total Deductions (B)</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getTotalDeductions()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Special Allowance</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getAllowances().getSpecialAllowance()).append("</td>");
        htmlBuilder.append("<td colspan=\"2\"><strong>Tax Deductions (C)</strong></td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Other Allowances</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getAllowances().getOtherAllowances()).append("</td>");
        htmlBuilder.append("<th>Professional Tax</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getPfTax()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Total Earnings (A)</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getTotalEarnings()).append("</td>");
        htmlBuilder.append("<th>Income Tax</th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getIncomeTax()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th></th>");
        htmlBuilder.append("<td></td>");
        htmlBuilder.append("<th><strong>Total Tax (C)</strong></th>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getDeductions().getTotalTax()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th></th>");
        htmlBuilder.append("<td></td>");
        htmlBuilder.append("<td><strong>Net Pay (A-B-C)</strong></td>");
        htmlBuilder.append("<td>").append(payslipEntity.getSalary().getNetSalary()).append("</td>");
        htmlBuilder.append("</tr>");
        htmlBuilder.append("<tr>");
        htmlBuilder.append("<th>Net Salary (In Words)</th>");
        htmlBuilder.append("<td colspan=\"3\">").append(payslipEntity.getInWords()).append("</td>");
        htmlBuilder.append("</tr>");

        htmlBuilder.append("</table>");
        htmlBuilder.append("</div>");

        htmlBuilder.append("<div class=\"text\">");
        htmlBuilder.append("<p><small>This is computer-generated payslip and does not require authentication</small></p>");
        htmlBuilder.append("</div>");
        htmlBuilder.append("<div class=\"address\">");
        htmlBuilder.append("<hr />");
        htmlBuilder.append("<p>Company Address: ").append(company.getCompanyAddress()+", Mobile No:"+company.getMobileNo()+", emailId:"+company.getEmailId()).append("</p>");
        htmlBuilder.append("</div>");

        htmlBuilder.append("</div>");
        htmlBuilder.append("</div>");
        htmlBuilder.append("</body>");
        htmlBuilder.append("</html>");

        return htmlBuilder.toString();
    }


}