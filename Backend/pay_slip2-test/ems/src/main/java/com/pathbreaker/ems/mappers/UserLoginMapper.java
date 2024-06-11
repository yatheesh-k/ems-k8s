package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.UserLogin;
import com.pathbreaker.payslip.request.UserRequest;
import com.pathbreaker.payslip.request.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserLoginMapper {
    UserLogin entityToRequest(UserRequest userRequest);

    UserLogin updateEntityFromRequest(UserUpdateRequest userUpdateRequest, @MappingTarget UserLogin userLoginEntity);
}
