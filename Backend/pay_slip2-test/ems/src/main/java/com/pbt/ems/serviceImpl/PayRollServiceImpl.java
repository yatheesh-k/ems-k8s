package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Employee;
import com.pbt.ems.entity.PayRoll;
import com.pbt.ems.entity.Salary;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.PayRollMapper;
import com.pbt.ems.repository.EmployeeRepository;
import com.pbt.ems.repository.PayRollRepository;
import com.pbt.ems.repository.SalaryRepository;
import com.pbt.ems.request.PayRollRequest;
import com.pbt.ems.response.PayRollResponse;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.service.PayRollService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PayRollServiceImpl implements PayRollService {

    @Autowired
    public PayRollServiceImpl(PayRollRepository payRollRepository, SalaryRepository salaryRepository, PayRollMapper payrollMapper, EmployeeRepository employeeRepository) {
        this.payRollRepository = payRollRepository;
        this.salaryRepository = salaryRepository;
        this.payrollMapper = payrollMapper;
        this.employeeRepository = employeeRepository;
    }
    private final PayRollRepository payRollRepository;
    private final SalaryRepository salaryRepository;
    private final PayRollMapper payrollMapper;
    private final EmployeeRepository employeeRepository;

    public ResponseEntity<?> createPayroll(PayRollRequest payRollRequest, String employeeId) {
        try {
            Optional<Employee> employee = employeeRepository.findByEmployeeId(employeeId);
            if (employee.isEmpty()){
                throw new BaseException(HttpStatus.NOT_FOUND, "The employee with " + employeeId + " not found");
            }
            Salary currentSalary = salaryRepository.findByEmployee(employee.get());

            // Add the increment amount to the fixed amount in the current salary details
            double incrementAmount = payRollRequest.getIncrementAmount();
            double updatedFixedAmount = currentSalary.getFixedAmount() + incrementAmount;

            // Update the fixed amount in the current salary details
            currentSalary.setFixedAmount(updatedFixedAmount);

            // Save the updated salary details
            salaryRepository.save(currentSalary);

            String highestPayrollIdId = payRollRepository.findHighestPayrollId();
            int digit = 1;
            if (highestPayrollIdId != null) {
                digit = Integer.parseInt(highestPayrollIdId.substring(3)) + 1;
            }
            String format = "PA%03d";
            String payrollId = String.format(format, digit);

            PayRoll payroll = payrollMapper.entityToRequest(payRollRequest);
            payroll.setPayRollId(payrollId);
            payroll.setEmployee(employee.get());
            payRollRepository.save(payroll);

            ResultResponse result = new ResultResponse();
            log.info("Payroll generated is successful for employee ID : {}" ,employeeId);
            result.setResult("Payroll generated is successful ");

            return ResponseEntity.ok(result);
        } catch (BaseException ex) {
            String message = "An error occurred during payroll creation " + ex;
            log.error(message);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    @Override
    public List<PayRollResponse> getAllPayrolls() {
        List<PayRoll> payrollsList = payRollRepository.findAll();

        // Prioritize employees based on status: Active > Notice Period > Relieved
        List<PayRollResponse> payRollResponses = payrollsList.stream()
                .map(payrollMapper::entityToResponse)
                .collect(Collectors.toList());

        log.info("The retrieved payroll details are " + payrollsList.size());

        return payRollResponses;
    }

    @Override
    public List<PayRollResponse> getPayrollByEmployeeId(String employeeId) {
        try {
            // Fetch all payroll records for the specified employee ID
            List<PayRoll> payrolls = payRollRepository.findByEmployeeEmployeeId(employeeId);

            if (payrolls.isEmpty()) {
                throw new BaseException(HttpStatus.NOT_FOUND, "No payrolls found for the employee with ID " + employeeId);
            }

            // Map the payroll entities to response DTOs
            List<PayRollResponse> responses = payrolls.stream()
                    .map(payrollMapper::entityToResponse)
                    .collect(Collectors.toList());

            log.info("Retrieving payroll details for employee ID {}: {}", employeeId, responses);
            return responses;
        } catch (BaseException ex) {
            // Handle other exceptions
            String message = "An error occurred while retrieving payrolls for employee ID: " + employeeId;
            log.error(message, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }


    @Override
    public ResponseEntity<?> updatePayrollById(String payRollId, PayRollRequest payRollRequest) {
        try {
            Optional<PayRoll> payrollOptional = payRollRepository.findById(payRollId);

            if (payrollOptional.isPresent()) {
                PayRoll payroll = payrollOptional.get();

                // Update the existing resource with the new data from the request
                PayRoll payroll1 = payrollMapper.updateEntityFromRequest(payRollRequest, payroll);
                // Update the resource skills entity as well, assuming it is a separate entity

                // Save the updated resource to the database
                payRollRepository.save(payroll1);
                // loginRepository.save(loginEntity);

                ResultResponse result = new ResultResponse();
                log.info("payroll updated is successful for payrollId : {}" ,payRollId);
                result.setResult("payroll updated is successful for payrollId : "+payRollId);

                return ResponseEntity.ok(result);
            } else {
                log.warn("The payroll not found with ID : {}", payRollId);
                throw new BaseException(HttpStatus.NOT_FOUND, "The payroll with " + payRollId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occurred while updating the payroll : {} " ,payRollId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while updating the payroll " + payRollId);
        }
    }
    @Override
    public ResponseEntity<?> deletePayrollById(String payrollId) {
        try {
            Optional<PayRoll> existingPayrollOptional = payRollRepository.findById(payrollId);

            if (existingPayrollOptional.isPresent()) {
                PayRoll payroll = existingPayrollOptional.get();
                // Delete associated resource skills

                // Delete the resource
                payRollRepository.delete(payroll);

                ResultResponse result = new ResultResponse();
                log.info("payroll deletion is successful for payrollId: {}",payrollId);
                result.setResult("Payroll deleted is successful.....");

                return ResponseEntity.ok(result);
            } else {
                log.warn("The payroll not found with {}",payrollId);
                throw new BaseException(HttpStatus.NOT_FOUND, "The payroll with " + payrollId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occurred while deleting the payroll {}",payrollId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting the payroll "+payrollId);
        }
    }


}
