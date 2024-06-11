package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Relieving;
import com.pathbreaker.payslip.request.RelievingRequest;
import com.pathbreaker.payslip.request.RelievingUpdateRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:55+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class RelievingMapperImpl implements RelievingMapper {

    @Override
    public Relieving entityToRequest(RelievingRequest relievingRequest) {
        if ( relievingRequest == null ) {
            return null;
        }

        Relieving relieving = new Relieving();

        relieving.setEmployeeId( relievingRequest.getEmployeeId() );
        relieving.setDesignation( relievingRequest.getDesignation() );
        relieving.setTypeOfEmployement( relievingRequest.getTypeOfEmployement() );
        relieving.setResignationDate( relievingRequest.getResignationDate() );
        relieving.setLastWorkingDate( relievingRequest.getLastWorkingDate() );

        return relieving;
    }

    @Override
    public Relieving updateEntityFromRequest(RelievingUpdateRequest relievingRequest, Relieving entity) {
        if ( relievingRequest == null ) {
            return entity;
        }

        entity.setDesignation( relievingRequest.getDesignation() );
        entity.setTypeOfEmployement( relievingRequest.getTypeOfEmployement() );
        entity.setResignationDate( relievingRequest.getResignationDate() );
        entity.setLastWorkingDate( relievingRequest.getLastWorkingDate() );

        return entity;
    }
}
