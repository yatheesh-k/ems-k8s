package com.pathbreaker.payslip.mappers;

import com.pathbreaker.payslip.entity.UserLogin;
import com.pathbreaker.payslip.request.UserRequest;
import com.pathbreaker.payslip.request.UserUpdateRequest;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-05-28T13:11:55+0530",
    comments = "version: 1.5.3.Final, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class UserLoginMapperImpl implements UserLoginMapper {

    @Override
    public UserLogin entityToRequest(UserRequest userRequest) {
        if ( userRequest == null ) {
            return null;
        }

        UserLogin userLogin = new UserLogin();

        userLogin.setEmailId( userRequest.getEmailId() );
        userLogin.setUserName( userRequest.getUserName() );
        userLogin.setPassword( userRequest.getPassword() );
        userLogin.setRole( userRequest.getRole() );

        return userLogin;
    }

    @Override
    public UserLogin updateEntityFromRequest(UserUpdateRequest userUpdateRequest, UserLogin userLoginEntity) {
        if ( userUpdateRequest == null ) {
            return userLoginEntity;
        }

        userLoginEntity.setEmailId( userUpdateRequest.getEmailId() );
        userLoginEntity.setUserName( userUpdateRequest.getUserName() );
        userLoginEntity.setPassword( userUpdateRequest.getPassword() );
        userLoginEntity.setRole( userUpdateRequest.getRole() );

        return userLoginEntity;
    }
}
