package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Designation;
import com.pathbreaker.payslip.request.DesignationRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DesignationMapper {

    Designation entityToRequest(DesignationRequest designationRequest);

}
