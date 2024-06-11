package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Employee;
import com.pathbreaker.payslip.entity.EmployeeLogin;
import com.pathbreaker.payslip.request.EmployeeLoginRequest;
import com.pathbreaker.payslip.request.EmployeeLoginRequestUpdate;
import com.pathbreaker.payslip.request.EmployeeRequest;
import com.pathbreaker.payslip.request.EmployeeUpdateRequest;
import com.pathbreaker.payslip.response.EmployeeLoginResponse;
import com.pathbreaker.payslip.response.EmployeeResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:55+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class EmployeeMapperImpl implements EmployeeMapper {

    @Override
    public Employee entityToRequest(EmployeeRequest employeeRequest) {
        if ( employeeRequest == null ) {
            return null;
        }

        Employee employee = new Employee();

        employee.setEmployeeId( employeeRequest.getEmployeeId() );
        employee.setEmployeeType( employeeRequest.getEmployeeType() );
        employee.setFirstName( employeeRequest.getFirstName() );
        employee.setLastName( employeeRequest.getLastName() );
        employee.setEmailId( employeeRequest.getEmailId() );
        employee.setPassword( employeeRequest.getPassword() );
        employee.setDesignation( employeeRequest.getDesignation() );
        employee.setDateOfHiring( employeeRequest.getDateOfHiring() );
        employee.setDepartment( employeeRequest.getDepartment() );
        employee.setLocation( employeeRequest.getLocation() );
        employee.setManager( employeeRequest.getManager() );
        employee.setRole( employeeRequest.getRole() );
        employee.setStatus( employeeRequest.getStatus() );
        employee.setIpAddress( employeeRequest.getIpAddress() );
        employee.setLoginEntity( employeeRequest.getLoginEntity() );

        return employee;
    }

    @Override
    public EmployeeResponse responseListToEntity(Employee employeeEntity) {
        if ( employeeEntity == null ) {
            return null;
        }

        EmployeeResponse employeeResponse = new EmployeeResponse();

        employeeResponse.setEmployeeId( employeeEntity.getEmployeeId() );
        employeeResponse.setEmployeeType( employeeEntity.getEmployeeType() );
        employeeResponse.setFirstName( employeeEntity.getFirstName() );
        employeeResponse.setLastName( employeeEntity.getLastName() );
        employeeResponse.setEmailId( employeeEntity.getEmailId() );
        employeeResponse.setPassword( employeeEntity.getPassword() );
        employeeResponse.setDesignation( employeeEntity.getDesignation() );
        employeeResponse.setDateOfHiring( employeeEntity.getDateOfHiring() );
        employeeResponse.setDepartment( employeeEntity.getDepartment() );
        employeeResponse.setLocation( employeeEntity.getLocation() );
        employeeResponse.setManager( employeeEntity.getManager() );
        employeeResponse.setRole( employeeEntity.getRole() );
        employeeResponse.setStatus( employeeEntity.getStatus() );
        employeeResponse.setIpAddress( employeeEntity.getIpAddress() );
        employeeResponse.setLoginResponse( employeeLoginToEmployeeLoginResponse( employeeEntity.getLoginEntity() ) );

        return employeeResponse;
    }

    @Override
    public Employee updateEntityFromRequest(EmployeeUpdateRequest employeeUpdateRequest, Employee employeeEntity) {
        if ( employeeUpdateRequest == null ) {
            return employeeEntity;
        }

        employeeEntity.setEmployeeType( employeeUpdateRequest.getEmployeeType() );
        employeeEntity.setFirstName( employeeUpdateRequest.getFirstName() );
        employeeEntity.setLastName( employeeUpdateRequest.getLastName() );
        employeeEntity.setEmailId( employeeUpdateRequest.getEmailId() );
        employeeEntity.setPassword( employeeUpdateRequest.getPassword() );
        employeeEntity.setDesignation( employeeUpdateRequest.getDesignation() );
        employeeEntity.setDateOfHiring( employeeUpdateRequest.getDateOfHiring() );
        employeeEntity.setDepartment( employeeUpdateRequest.getDepartment() );
        employeeEntity.setLocation( employeeUpdateRequest.getLocation() );
        employeeEntity.setManager( employeeUpdateRequest.getManager() );
        employeeEntity.setRole( employeeUpdateRequest.getRole() );
        employeeEntity.setStatus( employeeUpdateRequest.getStatus() );
        employeeEntity.setIpAddress( employeeUpdateRequest.getIpAddress() );

        return employeeEntity;
    }

    @Override
    public Employee employeeEntityToRequest(EmployeeLoginRequest loginRequest) {
        if ( loginRequest == null ) {
            return null;
        }

        Employee employee = new Employee();

        employee.setEmailId( loginRequest.getEmailId() );
        employee.setPassword( loginRequest.getPassword() );
        employee.setRole( loginRequest.getRole() );
        employee.setStatus( loginRequest.getStatus() );
        employee.setIpAddress( loginRequest.getIpAddress() );

        return employee;
    }

    @Override
    public Employee updateEmployeeEntityFromRequest(EmployeeLoginRequestUpdate loginRequestUpdate, Employee employeeEntity) {
        if ( loginRequestUpdate == null ) {
            return employeeEntity;
        }

        employeeEntity.setEmailId( loginRequestUpdate.getEmailId() );
        employeeEntity.setPassword( loginRequestUpdate.getPassword() );
        employeeEntity.setRole( loginRequestUpdate.getRole() );
        employeeEntity.setStatus( loginRequestUpdate.getStatus() );
        employeeEntity.setIpAddress( loginRequestUpdate.getIpAddress() );

        return employeeEntity;
    }

    protected EmployeeLoginResponse employeeLoginToEmployeeLoginResponse(EmployeeLogin employeeLogin) {
        if ( employeeLogin == null ) {
            return null;
        }

        EmployeeLoginResponse employeeLoginResponse = new EmployeeLoginResponse();

        employeeLoginResponse.setId( employeeLogin.getId() );
        if ( employeeLogin.getOtp() != null ) {
            employeeLoginResponse.setOtp( employeeLogin.getOtp().intValue() );
        }
        employeeLoginResponse.setEmailId( employeeLogin.getEmailId() );
        employeeLoginResponse.setPassword( employeeLogin.getPassword() );
        employeeLoginResponse.setStatus( employeeLogin.getStatus() );
        employeeLoginResponse.setLastLoginTime( employeeLogin.getLastLoginTime() );
        employeeLoginResponse.setRole( employeeLogin.getRole() );
        employeeLoginResponse.setIpAddress( employeeLogin.getIpAddress() );

        return employeeLoginResponse;
    }
}
