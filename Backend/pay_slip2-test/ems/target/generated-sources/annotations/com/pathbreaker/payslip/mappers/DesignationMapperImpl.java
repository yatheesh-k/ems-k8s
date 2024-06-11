package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Designation;
import com.pathbreaker.payslip.request.DesignationRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:56+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class DesignationMapperImpl implements DesignationMapper {

    @Override
    public Designation entityToRequest(DesignationRequest designationRequest) {
        if ( designationRequest == null ) {
            return null;
        }

        Designation designation = new Designation();

        designation.setId( designationRequest.getId() );
        designation.setDesignationTitle( designationRequest.getDesignationTitle() );

        return designation;
    }
}
