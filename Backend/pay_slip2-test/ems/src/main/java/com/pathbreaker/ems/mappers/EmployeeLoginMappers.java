package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.EmployeeLogin;
import com.pathbreaker.payslip.request.EmployeeRequest;
import com.pathbreaker.payslip.request.EmployeeUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface EmployeeLoginMappers {

    EmployeeLogin entityToRequest(EmployeeRequest employeeRequest);

    EmployeeLogin updateEntityFromRequest(EmployeeUpdateRequest employeeUpdateRequest, @MappingTarget EmployeeLogin loginEntity);

}
