package com.pbt.ems.mappers;

import com.pbt.ems.entity.EmployeeLogin;
import com.pbt.ems.request.EmployeeRequest;
import com.pbt.ems.request.EmployeeUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EmployeeLoginMappers {

    EmployeeLogin entityToRequest(EmployeeRequest employeeRequest);

    EmployeeLogin updateEntityFromRequest(EmployeeUpdateRequest employeeUpdateRequest, @MappingTarget EmployeeLogin loginEntity);

}
