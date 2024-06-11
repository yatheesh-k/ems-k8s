package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.PaySlip;
import com.pathbreaker.payslip.request.PaySlipUpdateRequest;
import com.pathbreaker.payslip.request.PaySlipsRequest;
import com.pathbreaker.payslip.response.PaySlipsResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaySlipMapper {
    PaySlip entityToRequest(PaySlipsRequest paySlipsRequest);

    @Mappings({
            @Mapping(target = "employeeId", source = "paySlip.employeeId"),
            @Mapping(target = "id", source = "paySlip.id"),
            @Mapping(target = "month", source = "paySlip.month"),
            @Mapping(target = "year", source = "paySlip.year"),
            @Mapping(target = "filePaths", source = "paySlip.filePaths"),
    })
    PaySlipsResponse entityToResponse(PaySlip paySlip);
}
