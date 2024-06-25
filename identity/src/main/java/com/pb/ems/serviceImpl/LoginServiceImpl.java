package com.pb.ems.serviceImpl;

import com.pb.ems.auth.JwtTokenUtil;
import com.pb.ems.common.ResponseBuilder;
import com.pb.ems.exception.ErrorMessageHandler;
import com.pb.ems.exception.IdentityErrorMessageKey;
import com.pb.ems.exception.IdentityException;
import com.pb.ems.model.*;
import com.pb.ems.opensearch.OpenSearchOperations;
import com.pb.ems.persistance.Entity;
import com.pb.ems.service.LoginService;
import com.pb.ems.util.Constants;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

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
            EmployeeEntity user = openSearchOperations.getEMSAdminById(request.getUsername());
            if(user != null && user.getPassword() != null) {
                String password = new String(Base64.getDecoder().decode(user.getPassword()), StandardCharsets.UTF_8);
                if(request.getPassword().equals(password)) {
                    log.debug("Successfully logged into ems portal for {}", request.getUsername());
                } else {
                    log.error("Invalid credentials");
                    throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_CREDENTIALS),
                            HttpStatus.FORBIDDEN);
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
        EmployeeEntity employee;
        try{
            employee = openSearchOperations.getEmployeeById(request.getUsername(), request.getCompany());
            if(employee != null && employee.getPassword() != null) {
                String password = new String(Base64.getDecoder().decode(employee.getPassword()), StandardCharsets.UTF_8);
                if(request.getPassword().equals(password)) {
                    log.debug("Successfully logged into ems portal for {}", request.getUsername());
                } else {
                    log.error("Invalid credentials");
                    throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_CREDENTIALS),
                            HttpStatus.FORBIDDEN);
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
        if(employee != null && employee.getRoles() != null && employee.getRoles().size() > 0) {
            roles.addAll(employee.getRoles());
        } else {
            roles.add(Constants.COMPANY_ADMIN);
        }

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

    @Override
    public ResponseEntity<?> updateEmsAdmin(LoginRequest request) throws IdentityException {
        try{
            EmployeeEntity user = openSearchOperations.getEMSAdminById(request.getUsername());
            if(user == null ) {
                throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_USERNAME),
                        HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex ){
            log.error("Exception while fetching user {}, {}", request.getUsername(), ex);
            throw new IdentityException(ErrorMessageHandler.getMessage(IdentityErrorMessageKey.INVALID_USERNAME),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        String id = Constants.EMS_ADMIN+"_"+request.getUsername();
        Entity entity = EmployeeEntity.builder().
                emailId(request.getUsername()).
                password(request.getPassword()).build();
        openSearchOperations.saveEntity(entity, id, Constants.INDEX_EMS);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.OK);
    }
}