package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Employee;
import com.pathbreaker.payslip.entity.EmployeeLogin;
import com.pathbreaker.payslip.request.EmployeeRequest;
import com.pathbreaker.payslip.request.EmployeeUpdateRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:55+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class EmployeeLoginMappersImpl implements EmployeeLoginMappers {

    @Override
    public EmployeeLogin entityToRequest(EmployeeRequest employeeRequest) {
        if ( employeeRequest == null ) {
            return null;
        }

        EmployeeLogin employeeLogin = new EmployeeLogin();

        employeeLogin.setEmailId( employeeRequest.getEmailId() );
        employeeLogin.setPassword( employeeRequest.getPassword() );
        employeeLogin.setStatus( employeeRequest.getStatus() );
        employeeLogin.setRole( employeeRequest.getRole() );
        employeeLogin.setIpAddress( employeeRequest.getIpAddress() );
        employeeLogin.setEmployeeEntity( employeeLoginToEmployee( employeeRequest.getLoginEntity() ) );

        return employeeLogin;
    }

    @Override
    public EmployeeLogin updateEntityFromRequest(EmployeeUpdateRequest employeeUpdateRequest, EmployeeLogin loginEntity) {
        if ( employeeUpdateRequest == null ) {
            return loginEntity;
        }

        loginEntity.setEmailId( employeeUpdateRequest.getEmailId() );
        loginEntity.setPassword( employeeUpdateRequest.getPassword() );
        loginEntity.setStatus( employeeUpdateRequest.getStatus() );
        loginEntity.setRole( employeeUpdateRequest.getRole() );
        loginEntity.setIpAddress( employeeUpdateRequest.getIpAddress() );

        return loginEntity;
    }

    protected Employee employeeLoginToEmployee(EmployeeLogin employeeLogin) {
        if ( employeeLogin == null ) {
            return null;
        }

        Employee employee = new Employee();

        employee.setEmailId( employeeLogin.getEmailId() );
        employee.setPassword( employeeLogin.getPassword() );
        employee.setRole( employeeLogin.getRole() );
        employee.setStatus( employeeLogin.getStatus() );
        employee.setIpAddress( employeeLogin.getIpAddress() );

        return employee;
    }
}
