package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.Company;
import com.pathbreaker.payslip.entity.Employee;
import com.pathbreaker.payslip.request.CompanyRequest;
import com.pathbreaker.payslip.request.CompanyUpdateRequest;
import com.pathbreaker.payslip.response.CompanyResponse;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:55+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class CompanyMapperImpl implements CompanyMapper {

    @Override
    public Company requestToEntity(CompanyRequest companyRequest) {
        if ( companyRequest == null ) {
            return null;
        }

        Company company = new Company();

        company.setCompanyId( companyRequest.getCompanyId() );
        company.setCompanyName( companyRequest.getCompanyName() );
        company.setEmailId( companyRequest.getEmailId() );
        company.setPassword( companyRequest.getPassword() );
        company.setAddress( companyRequest.getAddress() );
        company.setMobileNo( companyRequest.getMobileNo() );
        company.setCompanyRegNo( companyRequest.getCompanyRegNo() );
        company.setGstNo( companyRequest.getGstNo() );
        company.setPanNo( companyRequest.getPanNo() );
        company.setImageFile( companyRequest.getImageFile() );
        List<Employee> list = companyRequest.getEmployee();
        if ( list != null ) {
            company.setEmployee( new ArrayList<Employee>( list ) );
        }

        return company;
    }

    @Override
    public List<CompanyResponse> entityToResponse(List<Company> companies) {
        if ( companies == null ) {
            return null;
        }

        List<CompanyResponse> list = new ArrayList<CompanyResponse>( companies.size() );
        for ( Company company : companies ) {
            list.add( entityToResponse2( company ) );
        }

        return list;
    }

    @Override
    public CompanyResponse entityToResponse2(Company company) {
        if ( company == null ) {
            return null;
        }

        CompanyResponse companyResponse = new CompanyResponse();

        companyResponse.setCompanyId( company.getCompanyId() );
        companyResponse.setCompanyName( company.getCompanyName() );
        companyResponse.setEmailId( company.getEmailId() );
        companyResponse.setPassword( company.getPassword() );
        companyResponse.setAddress( company.getAddress() );
        companyResponse.setMobileNo( company.getMobileNo() );
        companyResponse.setCompanyRegNo( company.getCompanyRegNo() );
        companyResponse.setGstNo( company.getGstNo() );
        companyResponse.setPanNo( company.getPanNo() );
        companyResponse.setImageFile( company.getImageFile() );
        List<Employee> list = company.getEmployee();
        if ( list != null ) {
            companyResponse.setEmployee( new ArrayList<Employee>( list ) );
        }

        return companyResponse;
    }

    @Override
    public Company updateEntityFromRequest(CompanyUpdateRequest companyUpdateRequest, Company company) {
        if ( companyUpdateRequest == null && company == null ) {
            return null;
        }

        Company company1 = new Company();

        if ( company != null ) {
            company1.setCompanyName( company.getCompanyName() );
            company1.setPassword( company.getPassword() );
            company1.setAddress( company.getAddress() );
            company1.setMobileNo( company.getMobileNo() );
            company1.setImageFile( company.getImageFile() );
            company1.setCompanyId( company.getCompanyId() );
            company1.setEmailId( company.getEmailId() );
            company1.setCompanyRegNo( company.getCompanyRegNo() );
            company1.setGstNo( company.getGstNo() );
            company1.setPanNo( company.getPanNo() );
            List<Employee> list = company.getEmployee();
            if ( list != null ) {
                company1.setEmployee( new ArrayList<Employee>( list ) );
            }
        }

        return company1;
    }
}
