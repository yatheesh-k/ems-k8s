package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.PaySlip;
import com.pathbreaker.payslip.request.PaySlipUpdateRequest;
import com.pathbreaker.payslip.request.PaySlipsRequest;
import com.pathbreaker.payslip.response.PaySlipsResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:56+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class PaySlipMapperImpl implements PaySlipMapper {

    @Override
    public PaySlip entityToRequest(PaySlipsRequest paySlipsRequest) {
        if ( paySlipsRequest == null ) {
            return null;
        }

        PaySlip paySlip = new PaySlip();

        paySlip.setEmployeeId( paySlipsRequest.getEmployeeId() );
        paySlip.setMonth( paySlipsRequest.getMonth() );
        paySlip.setFinancialYear( paySlipsRequest.getFinancialYear() );
        paySlip.setFilePaths( paySlipsRequest.getFilePaths() );

        return paySlip;
    }

    @Override
    public PaySlip entityToUpdateRequest(PaySlipUpdateRequest paySlipsRequest, PaySlip entity) {
        if ( paySlipsRequest == null ) {
            return entity;
        }

        entity.setMonth( paySlipsRequest.getMonth() );
        entity.setFinancialYear( paySlipsRequest.getFinancialYear() );

        return entity;
    }

    @Override
    public List<PaySlipsResponse> entityToResponseList(List<PaySlip> paySlipUploadEntities) {
        if ( paySlipUploadEntities == null ) {
            return null;
        }

        List<PaySlipsResponse> list = new ArrayList<PaySlipsResponse>( paySlipUploadEntities.size() );
        for ( PaySlip paySlip : paySlipUploadEntities ) {
            list.add( paySlipToPaySlipsResponse( paySlip ) );
        }

        return list;
    }

    protected PaySlipsResponse paySlipToPaySlipsResponse(PaySlip paySlip) {
        if ( paySlip == null ) {
            return null;
        }

        PaySlipsResponse paySlipsResponse = new PaySlipsResponse();

        paySlipsResponse.setId( paySlip.getId() );
        paySlipsResponse.setEmployeeId( paySlip.getEmployeeId() );
        paySlipsResponse.setMonth( paySlip.getMonth() );
        paySlipsResponse.setFinancialYear( paySlip.getFinancialYear() );
        paySlipsResponse.setFilePaths( paySlip.getFilePaths() );

        return paySlipsResponse;
    }
}
