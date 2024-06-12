package com.pbt.ems.mappers;

import com.pbt.ems.entity.PaySlip;
import com.pbt.ems.request.PaySlipsRequest;
import com.pbt.ems.response.PaySlipsResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

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
