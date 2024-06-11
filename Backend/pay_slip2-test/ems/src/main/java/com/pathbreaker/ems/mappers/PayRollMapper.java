package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.PayRoll;
import com.pathbreaker.payslip.request.PayRollRequest;
import com.pathbreaker.payslip.response.PayRollResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface PayRollMapper {
    @Mappings({
            @Mapping(target = "month", source = "payRollRequest.month"),
            @Mapping(target = "year", source = "payRollRequest.year"),
            @Mapping(target = "incrementAmount", source = "payRollRequest.incrementAmount"),
            @Mapping(target = "incrementPurpose", source = "payRollRequest.incrementPurpose"),
    })
    PayRoll entityToRequest(PayRollRequest payRollRequest);

    @Mappings({
            @Mapping(target = "payRollId", source = "payroll.payRollId"),
            @Mapping(target = "month", source = "payroll.month"),
            @Mapping(target = "year", source = "payroll.year"),
            @Mapping(target = "incrementAmount", source = "payroll.incrementAmount"),
            @Mapping(target = "incrementPurpose", source = "payroll.incrementPurpose"),
    })
    PayRollResponse entityToResponse(PayRoll payroll);

    PayRoll updateEntityFromRequest(PayRollRequest payRollRequest, @MappingTarget PayRoll payroll);

}
