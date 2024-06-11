package com.pathbreaker.payslip.serviceImpl;

import com.pathbreaker.payslip.entity.*;
import com.pathbreaker.payslip.exception.Exceptions;
import com.pathbreaker.payslip.exception.NotFoundException;
import com.pathbreaker.payslip.mappers.AttendanceMapper;
import com.pathbreaker.payslip.mappers.SalaryMapper;
import com.pathbreaker.payslip.repository.*;
import com.pathbreaker.payslip.request.SalaryRequest;
import com.pathbreaker.payslip.response.AllowanceResponse;
import com.pathbreaker.payslip.response.DeductionResponse;
import com.pathbreaker.payslip.response.ResultResponse;
import com.pathbreaker.payslip.response.SalaryResponse;
import com.pathbreaker.payslip.service.SalaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SalaryServiceImpl implements SalaryService {

    @Autowired
    public SalaryServiceImpl(EmployeeRepository employeeRepository,
                             AttendanceRepository attendanceRepository, SalaryRepository salaryRepository,
                             DeductionRepository deductionRepository, AllowanceRepository allowanceRepository, SalaryMapper salaryMapper, AttendanceMapper attendanceMapper) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaryRepository = salaryRepository;
        this.deductionRepository = deductionRepository;
        this.allowanceRepository = allowanceRepository;
        this.salaryMapper = salaryMapper;
        this.attendanceMapper = attendanceMapper;
    }

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryRepository salaryRepository;
    private final DeductionRepository deductionRepository;
    private final AllowanceRepository allowanceRepository;
    private final SalaryMapper salaryMapper;
    private final AttendanceMapper attendanceMapper;

    public String generateId(String entityType) {
        String highestId = null;
        String prefix = null;

        switch (entityType) {
            case "SALARY":
                highestId = salaryRepository.findHighestSalaryId();
                prefix = "SA";
                break;
            case "DEDUCTION":
                highestId = deductionRepository.findHighestDeductionId();
                prefix = "DE";
                break;
            case "ALLOWANCE":
                highestId = allowanceRepository.findHighestAllowanceId();
                prefix = "AL";
                break;
            default:
                throw new IllegalArgumentException("Unknown entity type: " + entityType);
        }

        int numericPart = 1;
        if (highestId != null && highestId.length() >= 5) {
            numericPart = Integer.parseInt(highestId.substring(2)) + 1;
        }
        String idFormat = prefix + "%03d";
        String generatedId = String.format(idFormat, numericPart);

        // Print the generated ID
        System.out.println("Generated " + entityType + " ID: " + generatedId);

        return generatedId;
    }

    @Override
    public ResponseEntity<?> addSalary(String employeeId, SalaryRequest salaryRequest) {
        try {
            // Check if the employee exists
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(employeeId);
            if (employeeOptional.isEmpty()) {
                log.warn("Employee with Id '{}' not found.", employeeId);
                throw new NotFoundException(HttpStatus.BAD_REQUEST, "The Employee is not found");
            }
            // Check if the employee already has a salary
            Employee employee = employeeOptional.get();
            if (salaryRepository.existsByEmployee(employee)) {
                log.warn("Salary for employee with Id '{}' already exists.", employeeId);
                throw new NotFoundException(HttpStatus.NOT_ACCEPTABLE,"Salary for the employee already exists");
            }

            Salary salary = salaryMapper.entityToRequest(salaryRequest);
            salary.setSalaryId(generateId("SALARY"));
            salary.setEmployee(employee);
            salary.getAllowances().setAllowanceId(generateId("ALLOWANCE"));
            allowanceRepository.save(salary.getAllowances());
            salary.getDeductions().setDeductionId(generateId("DEDUCTION"));
            deductionRepository.save(salary.getDeductions());

            // Save the Salary entity
            salaryRepository.save(salary);

            ResultResponse result = new ResultResponse();
            log.info("Salary Structure added successfully for employee {} ", employeeId);
            result.setResult("Salary Structure added successfully for employee " + employeeId);

            return ResponseEntity.ok(result);
        } catch (Exceptions ex) {
            String message = "An error occurred during Adding the Salary to the employee " + ex.getMessage();
            log.error(message, ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR,message);
        }
    }


    @Override
    public List<SalaryResponse> getAllSalaries() {
        List<Salary> salaryList = salaryRepository.findAll();

        List<SalaryResponse> salaryResponses = salaryList.stream()
                .map(salary -> {
                    SalaryResponse response = salaryMapper.responseToEntity(salary);
                    formatSalaryResponse(response);
                    return response;
                })
                .collect(Collectors.toList());

        log.info("The retrieved Salaries details are : {} ", salaryResponses.size());

        return salaryResponses;
    }

    @Override
    public SalaryResponse getSalariesByEmpId(String employeeId) {
        try {
            // Assuming there's a method to get Employee by their ID string
            Optional<Employee> employee = employeeRepository.findByEmployeeId(employeeId);
            if (employee.isEmpty()) {
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The Employee with ID " + employeeId + " not found");
            }
            Salary salary = salaryRepository.findByEmployee(employee.get());

            // Map the retrieved entities to the response object
            SalaryResponse salaryResponse = salaryMapper.responseToEntity(salary);
            formatSalaryResponse(salaryResponse);
            // Assuming you have a method to map Attendance entity to its response
            return salaryResponse;
        } catch (Exceptions ex) {
            // Handle other exceptions
            log.error("An error occurred while retrieving employee by ID: {}" ,employeeId, ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving employee by ID: " + employeeId);
        }
    }
    @Override
    public ResponseEntity<?> updateBySalaryId(String salaryId, SalaryRequest salaryRequest) {
        try {
            Optional<Salary> salaryOptional = salaryRepository.findById(salaryId);
            if (salaryOptional.isPresent()){

                // Update the existing resource with the new data from the request
                Salary updatedSalary = salaryMapper.updateEntityFromRequest(salaryRequest, salaryOptional.get());
                // Save the updated resource to the database
                salaryRepository.save(updatedSalary);

                ResultResponse result = new ResultResponse();
                log.info("Salary update is successful for salaryId: {}", salaryId);
                result.setResult("Salary update is successful for salaryId: " + salaryId);

                return ResponseEntity.ok(result);
            } else {
                log.warn("The Salary not found with id: {}", salaryId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The Salary with " + salaryId + " not found");
            }
        } catch (Exceptions ex) {
            log.warn("An error occurred while updating the Salary: {}", salaryId);
            String message = "An error occurred while updating the Salary " + salaryId + ": " + ex.getMessage();
            log.error(message, ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    private void formatSalaryResponse(SalaryResponse response) {
        DecimalFormat decimalFormat = new DecimalFormat("#.#");

        response.setFixedAmount(formatDouble(response.getFixedAmount(), decimalFormat));
        response.setVariableAmount(formatDouble(response.getVariableAmount(), decimalFormat));
        response.setGrossAmount(formatDouble(response.getGrossAmount(), decimalFormat));

        AllowanceResponse allowances = response.getAllowances();
        if (allowances != null) {
            allowances.setBasicSalary(formatDouble(allowances.getBasicSalary(), decimalFormat));
            allowances.setTravelAllowance(formatDouble(allowances.getTravelAllowance(), decimalFormat));
            allowances.setPfContributionEmployee(formatDouble(allowances.getPfContributionEmployee(), decimalFormat));
            allowances.setHra(formatDouble(allowances.getHra(), decimalFormat));
            allowances.setSpecialAllowance(formatDouble(allowances.getSpecialAllowance(), decimalFormat));
            allowances.setTotalEarnings(formatDouble(allowances.getTotalEarnings(), decimalFormat));
            allowances.setOtherAllowances(formatDouble(allowances.getOtherAllowances(), decimalFormat));
        }

        DeductionResponse deductions = response.getDeductions();
        if (deductions != null) {
            deductions.setPfEmployee(formatDouble(deductions.getPfEmployee(), decimalFormat));
            deductions.setPfEmployer(formatDouble(deductions.getPfEmployer(), decimalFormat));
            deductions.setLop(formatDouble(deductions.getLop(), decimalFormat));
            deductions.setPfTax(formatDouble(deductions.getPfTax(), decimalFormat));
            deductions.setIncomeTax(formatDouble(deductions.getIncomeTax(), decimalFormat));
            deductions.setTotalDeductions(formatDouble(deductions.getTotalDeductions(), decimalFormat));
            deductions.setNetSalary(formatDouble(deductions.getNetSalary(), decimalFormat));
        }
    }
    private double formatDouble(double value, DecimalFormat decimalFormat) {
        return Double.parseDouble(decimalFormat.format(value));
    }


}
