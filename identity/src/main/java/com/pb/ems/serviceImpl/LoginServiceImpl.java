package com.pb.ems.serviceImpl;

import com.pb.ems.auth.JwtTokenUtil;
import com.pb.ems.common.ResponseBuilder;
import com.pb.ems.common.ResponseObject;
import com.pb.ems.exception.ErrorMessageHandler;
import com.pb.ems.exception.IdentityErrorMessageKey;
import com.pb.ems.exception.IdentityException;
import com.pb.ems.model.*;
import com.pb.ems.opensearch.OpenSearchOperations;
import com.pb.ems.service.LoginService;
import com.pb.ems.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
@Slf4j
public class LoginServiceImpl implements LoginService {

    @Autowired
    private OpenSearchOperations openSearchOperations;
    /**
     * @param request
     * @return
     */
    @Override
    public ResponseEntity<?> login(LoginRequest request) throws IdentityException {
        try{
            UserEntity user = openSearchOperations.getEMSAdminById(request.getUsername());
            if(user != null && user.getPassword() != null) {
                String password = new String(Base64.getDecoder().decode(user.getPassword()), StandardCharsets.UTF_8);
                if(request.getPassword().equals(password)) {
                    log.debug("Successfully logged into ems portal for {}", request.getUsername());
                }
            } else {
                log.error("Invalid credentials");
                throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_CREDENTIALS),
                        HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            log.error("Invalid creds {}", e.getMessage(),e);
            throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_CREDENTIALS),
                    HttpStatus.FORBIDDEN);
        }
        List<String> roles = new ArrayList<>();
        roles.add(Constants.EMS_ADMIN);
        String token = JwtTokenUtil.generateToken(request.getUsername(), roles);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(new LoginResponse(token, null)), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<?> employeeLogin(EmployeeLoginRequest request) throws IdentityException {
        try{
            UserEntity user = openSearchOperations.getEmployeeById(request.getUsername(), request.getCompany());
            if(user != null && user.getPassword() != null) {
                String password = new String(Base64.getDecoder().decode(user.getPassword()), StandardCharsets.UTF_8);
                if(request.getPassword().equals(password)) {
                    log.debug("Successfully logged into ems portal for {}", request.getUsername());
                }
            } else {
                log.error("Invalid credentials");
                throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_CREDENTIALS),
                        HttpStatus.FORBIDDEN);
            }
        } catch (Exception e) {
            log.error("Invalid creds {}", e.getMessage(),e);
            throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_CREDENTIALS),
                    HttpStatus.FORBIDDEN);
        }
        List<String> roles = new ArrayList<>();
        roles.add(Constants.EMS_ADMIN);
        String token = JwtTokenUtil.generateToken(request.getUsername(), roles);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(new LoginResponse(token, null)), HttpStatus.OK);
    }

    /**
     * @param loginRequest
     * @return
     */
    @Override
    public ResponseEntity<?> logout(OTPRequest loginRequest) {
        return null;
    }

    private Long generateOtp() {
        Random random = new Random();
        Long otp = 100000 + random.nextLong(900000);
        return otp;
    }
}
