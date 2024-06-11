package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.User;
import com.pathbreaker.payslip.entity.UserLogin;
import com.pathbreaker.payslip.request.UserRequest;
import com.pathbreaker.payslip.request.UserUpdateRequest;
import com.pathbreaker.payslip.response.UserLoginResponse;
import com.pathbreaker.payslip.response.UserResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:56+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User entityToRequest(UserRequest userRequest) {
        if ( userRequest == null ) {
            return null;
        }

        User user = new User();

        user.setUserId( userRequest.getUserId() );
        user.setEmailId( userRequest.getEmailId() );
        user.setUserName( userRequest.getUserName() );
        user.setPassword( userRequest.getPassword() );
        user.setRole( userRequest.getRole() );
        user.setStatus( userRequest.getStatus() );
        user.setIpAddress( userRequest.getIpAddress() );
        user.setRegistrationDate( userRequest.getRegistrationDate() );
        user.setUserLoginEntity( userRequest.getUserLoginEntity() );

        return user;
    }

    @Override
    public UserResponse responseListToEntity(User userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setEmailId( userEntity.getEmailId() );
        userResponse.setPassword( userEntity.getPassword() );
        userResponse.setUserId( userEntity.getUserId() );
        userResponse.setRole( userEntity.getRole() );
        userResponse.setStatus( userEntity.getStatus() );
        userResponse.setUserName( userEntity.getUserName() );
        userResponse.setRegistrationDate( userEntity.getRegistrationDate() );
        userResponse.setUserLoginResponse( userLoginToUserLoginResponse( userEntity.getUserLoginEntity() ) );
        userResponse.setIpAddress( userEntity.getIpAddress() );

        return userResponse;
    }

    @Override
    public User updateEntityFromRequest(UserUpdateRequest userUpdateRequest, User userEntity) {
        if ( userUpdateRequest == null ) {
            return userEntity;
        }

        userEntity.setEmailId( userUpdateRequest.getEmailId() );
        userEntity.setUserName( userUpdateRequest.getUserName() );
        userEntity.setPassword( userUpdateRequest.getPassword() );
        userEntity.setRole( userUpdateRequest.getRole() );
        userEntity.setStatus( userUpdateRequest.getStatus() );
        userEntity.setIpAddress( userUpdateRequest.getIpAddress() );
        userEntity.setRegistrationDate( userUpdateRequest.getRegistrationDate() );

        return userEntity;
    }

    protected UserLoginResponse userLoginToUserLoginResponse(UserLogin userLogin) {
        if ( userLogin == null ) {
            return null;
        }

        UserLoginResponse userLoginResponse = new UserLoginResponse();

        userLoginResponse.setId( userLogin.getId() );
        userLoginResponse.setEmailId( userLogin.getEmailId() );
        userLoginResponse.setUserName( userLogin.getUserName() );
        userLoginResponse.setPassword( userLogin.getPassword() );
        userLoginResponse.setRole( userLogin.getRole() );
        userLoginResponse.setLastLoginTime( userLogin.getLastLoginTime() );

        return userLoginResponse;
    }
}
