package com.pbt.ems.mappers;


import com.pbt.ems.entity.Company;
import com.pbt.ems.request.CompanyRequest;
import com.pbt.ems.request.CompanyUpdateRequest;
import com.pbt.ems.response.CompanyResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface CompanyMapper {

    Company entityToRequest(CompanyRequest companyRequest);

    @Mappings({
            @Mapping(target = "companyId", source = "company.companyId"),
            @Mapping(target = "companyName", source = "company.companyName"),
            @Mapping(target = "emailId", source = "company.emailId"),
            @Mapping(target = "password", source = "company.password"),
            @Mapping(target = "address", source = "company.address"),
            @Mapping(target = "mobileNo", source = "company.mobileNo"),
            @Mapping(target = "companyRegNo", source = "company.companyRegNo"),
            @Mapping(target = "landNo", source = "company.landNo"),
            @Mapping(target = "name", source = "company.name"),
            @Mapping(target = "gstNo", source = "company.gstNo"),
            @Mapping(target = "panNo", source = "company.panNo"),
            @Mapping(target = "personalMailId", source = "company.personalMailId"),
            @Mapping(target = "personalMobileNo", source = "company.personalMobileNo"),
            @Mapping(target = "companyAddress", source = "company.companyAddress"),
            @Mapping(target = "imageFile", source = "company.imageFile"),
    })
    CompanyResponse entityToResponse(Company company);

    Company updateEntityFromRequest(CompanyUpdateRequest companyUpdateRequest, @MappingTarget Company company);
}
