package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Relieving;
import com.pathbreaker.payslip.entity.Salary;
import com.pathbreaker.payslip.request.RelievingRequest;
import com.pathbreaker.payslip.request.RelievingUpdateRequest;
import com.pathbreaker.payslip.request.SalaryRequest;
import com.pathbreaker.payslip.response.SalaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SalaryMapper {
    Salary entityToRequest(SalaryRequest salaryRequest);

    @Mappings({
            @Mapping(target = "salaryId", source = "salary.salaryId"),
            @Mapping(target = "fixedAmount", source = "salary.fixedAmount"),
            @Mapping(target = "variableAmount", source = "salary.variableAmount"),
            @Mapping(target = "grossAmount", source = "salary.grossAmount"),
            @Mapping(target = "allowances", source = "salary.allowances"),
            @Mapping(target = "deductions", source = "salary.deductions"),
            @Mapping(target = "employee", source = "salary.employee"),
    })
    SalaryResponse responseToEntity(Salary salary);

    Salary updateEntityFromRequest(SalaryRequest salaryRequest, @MappingTarget  Salary salaryEntity);
}
