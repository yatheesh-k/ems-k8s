package com.pbt.ems.mappers;

import com.pbt.ems.entity.UserLogin;
import com.pbt.ems.request.UserRequest;
import com.pbt.ems.request.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserLoginMapper {
    UserLogin entityToRequest(UserRequest userRequest);

    UserLogin updateEntityFromRequest(UserUpdateRequest userUpdateRequest, @MappingTarget UserLogin userLoginEntity);
}
