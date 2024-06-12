package com.pbt.ems.mappers;

import com.pbt.ems.entity.Department;
import com.pbt.ems.request.DepartmentRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    Department entityToRequest(DepartmentRequest departmentRequest);

}
