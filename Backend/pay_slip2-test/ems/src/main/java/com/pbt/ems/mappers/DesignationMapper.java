package com.pbt.ems.mappers;

import com.pbt.ems.entity.Designation;
import com.pbt.ems.request.DesignationRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DesignationMapper {

    Designation entityToRequest(DesignationRequest designationRequest);

}
