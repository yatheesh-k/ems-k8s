package com.pb.employee.serviceImpl;

import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.PayslipRequest;
import com.pb.employee.service.PayslipService;
import com.pb.employee.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
                    PayslipEntity payslipProperties = PayslipUtils.unMaskEmployeePayslipProperties(salary, payslipRequest, paySlipId, employee.getId(), attendanceEntities);
                    PayslipUtils.formatNumericalFields(payslipProperties);
                    payslipProperties = PayslipUtils.maskEmployeePayslip(payslipProperties, salary, attendanceEntities);
                    generatedPayslips.add(payslipProperties);
                    payslipPropertiesList.add(payslipProperties);
                }

                // Save all payslips for the current employee
                for (PayslipEntity payslipProperties : payslipPropertiesList) {
                    openSearchOperations.saveEntity(payslipProperties, paySlipId, index);
                }
            }

            // Return response with generated payslips and employees without attendance
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("generatedPayslips", generatedPayslips);
            responseBody.put("employeesWithoutAttendance", employeesWithoutAttendance);

            return new ResponseEntity<>(
                    ResponseBuilder.builder().build().createSuccessResponse(responseBody), HttpStatus.CREATED);

        } catch (IOException | EmployeeException ex) {
            log.error("Error generating payslips: {}", ex.getMessage());
            throw ex; // Re-throw the caught exception for higher level handling

        } catch (Exception ex) {
            log.error("Unexpected error generating payslips: {}", ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_SAVE_EMPLOYEE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

}
