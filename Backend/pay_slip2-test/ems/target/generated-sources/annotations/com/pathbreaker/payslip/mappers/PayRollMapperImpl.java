package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.PayRoll;
import com.pathbreaker.payslip.request.PayRollRequest;
import com.pathbreaker.payslip.request.PayRollUpdateRequest;
import com.pathbreaker.payslip.response.PayRollResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:56+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class PayRollMapperImpl implements PayRollMapper {

    @Override
    public PayRoll entityToRequest(PayRollRequest payRollRequest) {
        if ( payRollRequest == null ) {
            return null;
        }

        PayRoll payRoll = new PayRoll();

        payRoll.setPayRollId( payRollRequest.getPayRollId() );
        payRoll.setMonth( payRollRequest.getMonth() );
        payRoll.setYear( payRollRequest.getYear() );
        payRoll.setIncrementAmount( payRollRequest.getIncrementAmount() );
        payRoll.setIncrementPurpose( payRollRequest.getIncrementPurpose() );
        payRoll.setEmployee( payRollRequest.getEmployee() );

        return payRoll;
    }

    @Override
    public PayRollResponse responseListToEntity(PayRoll payroll) {
        if ( payroll == null ) {
            return null;
        }

        PayRollResponse payRollResponse = new PayRollResponse();

        payRollResponse.setPayRollId( payroll.getPayRollId() );
        payRollResponse.setMonth( payroll.getMonth() );
        payRollResponse.setYear( payroll.getYear() );
        payRollResponse.setIncrementAmount( payroll.getIncrementAmount() );
        payRollResponse.setIncrementPurpose( payroll.getIncrementPurpose() );
        payRollResponse.setEmployee( payroll.getEmployee() );

        return payRollResponse;
    }

    @Override
    public PayRoll updateEntityFromRequest(PayRollUpdateRequest payrollUpdateRequest, PayRoll payroll) {
        if ( payrollUpdateRequest == null ) {
            return payroll;
        }

        payroll.setMonth( payrollUpdateRequest.getMonth() );
        payroll.setYear( payrollUpdateRequest.getYear() );
        payroll.setIncrementAmount( payrollUpdateRequest.getIncrementAmount() );
        payroll.setIncrementPurpose( payrollUpdateRequest.getIncrementPurpose() );

        return payroll;
    }
}
