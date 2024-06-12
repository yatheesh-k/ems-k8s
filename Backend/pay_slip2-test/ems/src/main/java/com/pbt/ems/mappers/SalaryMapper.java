package com.pbt.ems.mappers;

import com.pbt.ems.entity.Salary;
import com.pbt.ems.request.SalaryRequest;
import com.pbt.ems.response.SalaryResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

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
