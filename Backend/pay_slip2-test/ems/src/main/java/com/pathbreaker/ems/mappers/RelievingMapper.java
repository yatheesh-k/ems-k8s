package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Relieving;
import com.pathbreaker.payslip.request.RelievingRequest;
import com.pathbreaker.payslip.request.RelievingUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RelievingMapper {
    Relieving entityToRequest(RelievingRequest relievingRequest);

    Relieving updateEntityFromRequest(RelievingUpdateRequest relievingRequest, @MappingTarget Relieving entity);
}
