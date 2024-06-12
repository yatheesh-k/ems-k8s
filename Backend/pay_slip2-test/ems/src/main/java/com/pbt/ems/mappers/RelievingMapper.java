package com.pbt.ems.mappers;

import com.pbt.ems.entity.Relieving;
import com.pbt.ems.request.RelievingRequest;
import com.pbt.ems.request.RelievingUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RelievingMapper {
    Relieving entityToRequest(RelievingRequest relievingRequest);

    Relieving updateEntityFromRequest(RelievingUpdateRequest relievingRequest, @MappingTarget Relieving entity);
}
