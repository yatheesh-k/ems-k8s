package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.User;
import com.pathbreaker.payslip.request.UserRequest;
import com.pathbreaker.payslip.request.UserUpdateRequest;
import com.pathbreaker.payslip.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User entityToRequest(UserRequest userRequest);

    @Mappings({
            @Mapping(target = "emailId", source = "userEntity.emailId"),
            @Mapping(target = "password", source = "userEntity.password"),
            @Mapping(target = "userId", source = "userEntity.userId"),
            @Mapping(target = "role", source = "userEntity.role"),
            @Mapping(target = "status", source = "userEntity.status"),
            @Mapping(target = "userName", source = "userEntity.userName"),
            @Mapping(target = "registrationDate", source = "userEntity.registrationDate"),
            @Mapping(target = "userLoginResponse", source = "userEntity.userLoginEntity")
    })
   UserResponse responseListToEntity(User userEntity);

    User updateEntityFromRequest(UserUpdateRequest userUpdateRequest, @MappingTarget User userEntity);
}
