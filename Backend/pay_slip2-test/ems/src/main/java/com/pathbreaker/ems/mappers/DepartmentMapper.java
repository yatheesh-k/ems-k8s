package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Department;
import com.pathbreaker.payslip.request.DepartmentRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    Department entityToRequest(DepartmentRequest departmentRequest);

}
