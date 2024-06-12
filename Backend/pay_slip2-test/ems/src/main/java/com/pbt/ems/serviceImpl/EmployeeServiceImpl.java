package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.*;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.EmployeeLoginMappers;
import com.pbt.ems.mappers.EmployeeMapper;
import com.pbt.ems.passwordencrypt.PasswordEncoder;
import com.pbt.ems.repository.*;
import com.pbt.ems.request.EmployeeRequest;
import com.pbt.ems.request.EmployeeUpdateRequest;
import com.pbt.ems.response.EmployeeResponse;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               PasswordEncoder passwordEncoder, CompanyRepository companyRepository, EmployeeMapper employeeMapper,
                               EmployeeLoginMappers loginMappers,
                               EmployeeLoginRepository loginRepository){
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
        this.employeeMapper = employeeMapper;
        this.loginMappers = loginMappers;
        this.loginRepository = loginRepository;
    }
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    private final EmployeeLoginRepository loginRepository;
    private final EmployeeMapper employeeMapper;
    private final EmployeeLoginMappers loginMappers;

    @Override
    public ResponseEntity<?> createEmployee(String companyId, EmployeeRequest employeeRequest) {
        try {
            // Check if the company exists
            Optional<Company> companyOptional = companyRepository.findById(companyId);
            if (!companyOptional.isPresent()) {
                log.warn("Company with Id '{}' not found.", companyId);
                throw new BaseException(HttpStatus.BAD_REQUEST, "The Company is not found");
            }
            // Check if an employee with the same first name and last name already exists
            if (employeeRepository.existsByFirstNameAndLastName(employeeRequest.getFirstName(), employeeRequest.getLastName())) {
                log.warn("Employee with name '{}' already exists. Cannot add duplicate employee.",
                        employeeRequest.getFirstName() + " " + employeeRequest.getLastName());
                throw new BaseException(HttpStatus.BAD_REQUEST, "Employee with the same name already exists.");
            }
            // Check if an employee with the same emailId already exists
            if (employeeRepository.existsByEmailId(employeeRequest.getEmailId())) {
                log.warn("Employee with emailId '{}' already exists. Cannot add duplicate employee.",
                        employeeRequest.getEmailId());
                throw new BaseException(HttpStatus.BAD_REQUEST, "Employee with the same emailId already exists.");
            }

            // If the employee with the same name doesn't exist, proceed with saving
            Employee employeeEntity = employeeMapper.entityToRequest(employeeRequest);
            employeeEntity.setPassword(passwordEncoder.encryptPassword(employeeEntity.getPassword()));
            EmployeeLogin loginEntity = loginMappers.entityToRequest(employeeRequest);
            employeeEntity.setEmployeeLogin(loginEntity);
            loginEntity.setEmployee(employeeEntity);

            Company company = companyOptional.get();
            employeeEntity.setCompany(company);

            employeeRepository.save(employeeEntity);

            ResultResponse result = new ResultResponse();
            log.info("Employee Registration is successful " + employeeRequest.getEmployeeId());
            result.setResult("Employee Registration is successful " + employeeRequest.getEmployeeId());

            return ResponseEntity.ok(result);
        } catch (BaseException ex) {
            String message = "An error occurred during Employee registration " + ex;
            log.error(message);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    @Override
    public List<EmployeeResponse> getAllEmployees() {
        List<Employee> employeeEntities = employeeRepository.findAll();

        // Prioritize employees based on status: Active > Notice Period > Relieved
        List<EmployeeResponse> employeeResponses = employeeEntities.stream()
                .sorted(Comparator.comparingInt(employee -> {
                    employee.setPassword(passwordEncoder.decryptPassword(employee.getPassword()));
                    switch (employee.getStatus()) {
                        case 1:
                            return 0;
                        case 3:
                            return 1;
                        case 2:
                            return 2;
                        default:
                            return 3; // Set a default priority for other statuses
                    }
                }))
                .map(employeeMapper::responseListToEntity)
                .collect(Collectors.toList());

        log.info("The retrieved employee details are " + employeeResponses.size());

        return employeeResponses;
    }

    @Override
    public EmployeeResponse getEmployeeById(String employeeId) {
        try {
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(employeeId);
            if (employeeOptional.isPresent()) {

                Employee employeeEntity = employeeOptional.get();
                EmployeeResponse response = employeeMapper.responseListToEntity(employeeEntity);
                response.setPassword(passwordEncoder.decryptPassword(response.getPassword()));

                log.info("Retrieving the employee details of {}: " + employeeId);
                return response;
            } else {
                throw new BaseException(HttpStatus.NOT_FOUND, "The Employee with " + employeeId + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while retrieving employee by ID: " + employeeId, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving employee by ID: " + employeeId);
        }
    }

    @Override
    public ResponseEntity<?> updateEmployeeById(String employeeId, EmployeeUpdateRequest employeeUpdateRequest) {
        try {
            Optional<Employee> employeeEntityOptional = employeeRepository.findByEmployeeId(employeeId);

            if (employeeEntityOptional.isPresent()) {
                Employee employeeEntity = employeeEntityOptional.get();

                // Update the existing resource with the new data from the request
                Employee employee = employeeMapper.updateEntityFromRequest(employeeUpdateRequest, employeeEntity);
                employee.setPassword(passwordEncoder.encryptPassword(employee.getPassword()));
                // Update the resource skills entity as well, assuming it is a separate entity
                EmployeeLogin loginEntity = loginMappers.updateEntityFromRequest(employeeUpdateRequest, employeeEntity.getEmployeeLogin());

                employee.setEmployeeLogin(loginEntity);
                // Save the updated resource to the database
                employeeRepository.save(employee);
               // loginRepository.save(loginEntity);

                ResultResponse result = new ResultResponse();
                log.info("Employee updated is successful for employeeId: " + employeeId);
                result.setResult("Employee updated is successful for employeeId : "+employeeId);

                return ResponseEntity.ok(result);
            } else {
                log.warn("The employee not found with " + employeeId);
                throw new BaseException(HttpStatus.NOT_FOUND, "The employee with " + employeeId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occured while updating the employee " + employeeId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while updating the employee " + employeeId);
        }
    }
    @Override
    public ResponseEntity<?> deleteEmployeeById(String employeeId) {
        try {
            Optional<Employee> existingEmployeeOptional = employeeRepository.findByEmployeeId(employeeId);

            if (existingEmployeeOptional.isPresent()) {
                Employee employee = existingEmployeeOptional.get();
                // Delete associated resource skills
                if (employee.getEmployeeLogin() != null) {
                    loginRepository.delete(employee.getEmployeeLogin());
                }
                // Delete the resource
                employeeRepository.delete(employee);

                ResultResponse result = new ResultResponse();
                log.info("Employee deletion is successful for employeeId: " + employeeId);
                result.setResult("Employee deleted is successful.....");

                return ResponseEntity.ok(result);
            } else {
                log.warn("The employee not found with "+employeeId);
                throw new BaseException(HttpStatus.NOT_FOUND, "The employee with " + employeeId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occured while deleting the employee "+employeeId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while deleting the employee "+employeeId);
        }
    }


}
