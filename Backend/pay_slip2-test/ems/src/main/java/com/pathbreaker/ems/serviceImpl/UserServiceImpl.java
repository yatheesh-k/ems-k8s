package com.pathbreaker.payslip.serviceImpl;

import com.pathbreaker.payslip.entity.Company;
import com.pathbreaker.payslip.entity.User;
import com.pathbreaker.payslip.entity.UserLogin;
import com.pathbreaker.payslip.exception.Exceptions;
import com.pathbreaker.payslip.exception.NotFoundException;
import com.pathbreaker.payslip.mappers.UserLoginMapper;
import com.pathbreaker.payslip.mappers.UserMapper;
import com.pathbreaker.payslip.repository.CompanyRepository;
import com.pathbreaker.payslip.repository.UserLoginRepository;
import com.pathbreaker.payslip.repository.UserRepository;
import com.pathbreaker.payslip.request.UserRequest;
import com.pathbreaker.payslip.request.UserUpdateRequest;
import com.pathbreaker.payslip.response.ResultResponse;
import com.pathbreaker.payslip.response.UserResponse;
import com.pathbreaker.payslip.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    public UserServiceImpl(UserRepository userRepository,
                           CompanyRepository companyRepository, UserMapper userMapper,
                           UserLoginRepository userLoginRepository,
                           UserLoginMapper userLoginMapper){
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.userMapper = userMapper;
        this.userLoginRepository = userLoginRepository;
        this.userLoginMapper = userLoginMapper;
    }
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final UserMapper userMapper;
    private final UserLoginRepository userLoginRepository;
    private final UserLoginMapper userLoginMapper;
    @Override
    public ResponseEntity<?> createUser(String companyId,UserRequest userRequest) {
        try {
            Optional<Company> companyOptional = companyRepository.findById(companyId);
            Optional<User> existingUser = userRepository.findByUserName(userRequest.getUserName());
            Optional<User> existingUserByEmail = userRepository.findByEmailId(userRequest.getEmailId());

            if (!companyOptional.isPresent()) {
                log.warn("Company with Id '{}' not found.", companyId);
                throw new NotFoundException(HttpStatus.BAD_REQUEST, "The Company is not found");
            }
                      if (existingUser.isPresent()) {
                log.warn("User with name '{}' already exists. Cannot add duplicate User.", userRequest.getUserName());
                throw new NotFoundException(HttpStatus.BAD_REQUEST, "User with the same name already exists.");
            }
            if (existingUserByEmail.isPresent()) {
                log.warn("User with emailId '{}' already exists. Cannot add duplicate User.", userRequest.getEmailId());
                throw new NotFoundException(HttpStatus.BAD_REQUEST, "User with the same emailId already exists.");
            }

            User userEntity = userMapper.entityToRequest(userRequest);
            UserLogin userLoginEntity = userLoginMapper.entityToRequest(userRequest);
            userEntity.setUserLoginEntity(userLoginEntity);
            userLoginEntity.setUserEntity(userEntity);

            Company company = companyOptional.get();
            userEntity.setCompany(company);

            userRepository.save(userEntity);

            ResultResponse result = new ResultResponse();
            log.info("User Registration is successful " + userRequest.getUserId());
            result.setResult("User Registration is successful " + userRequest.getUserId());

            return ResponseEntity.ok(result);
        } catch (Exceptions ex) {
            String message = "An error occurred during User registration " + ex;
            log.error(message);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> userEntities = userRepository.findAll();

        // Prioritize users based on roles: Admin > Manager > Employee
        List<UserResponse> userResponses = userEntities.stream()
                .sorted(Comparator.comparingInt(user -> {
                    switch (user.getStatus()) {
                        case 1:
                            return 0;
                        case 3:
                            return 1;
                        case 2:
                            return 2;
                        case 4:
                            return 3; // Set a default priority for other roles
                        default:
                            return 4;
                    }
                }))
                .map(userMapper::responseListToEntity)
                .collect(Collectors.toList());

        log.info("The retrieved User details are " + userResponses.size());

        return userResponses;
    }

    @Override
    public UserResponse getUserById(String userId) {
        try {
            Optional<User> userEntityOptional = userRepository.findByUserId(userId);
            if (userEntityOptional.isPresent()) {

                User userEntity = userEntityOptional.get();
                UserResponse response = userMapper.responseListToEntity(userEntity);

                log.info("Retrieving the User details of {}: " + userId);
                return response;
            } else {
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The User with " + userId + " not found");
            }
        } catch (Exceptions ex) {
            // Handle other exceptions
            log.error("An error occurred while retrieving User by ID: " + userId, ex);
            throw new Exceptions(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving User by ID: " + userId);
        }
    }

    @Override
    public ResponseEntity<?> updateUserById(String userId, UserUpdateRequest userUpdateRequest) {
        try {
            Optional<User> userEntityOptional = userRepository.findByUserId(userId);

            if (userEntityOptional.isPresent()) {
                User userEntity = userEntityOptional.get();

                // Update the existing resource with the new data from the request
                User users = userMapper.updateEntityFromRequest(userUpdateRequest, userEntity);
                // Update the resource skills entity as well, assuming it is a separate entity
                UserLogin userLoginEntity = userLoginMapper.updateEntityFromRequest(userUpdateRequest, userEntity.getUserLoginEntity());

                users.setUserLoginEntity(userLoginEntity);
                // Save the updated resource to the database
                userRepository.save(users);
                // loginRepository.save(loginEntity);

                ResultResponse result = new ResultResponse();
                log.info("User updated is successful for userId: " + userId);
                result.setResult("User updated  successful for userId : "+userId);

                return ResponseEntity.ok(result);
            } else {
                log.warn("The User not found with " + userId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The User with " + userId + " not found");
            }
        } catch (Exceptions ex) {
            log.warn("An error occured while updating the USER " + userId);
            throw new NotFoundException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while updating the USER " + userId);
        }
    }
    @Override
    public ResponseEntity<?> deleteUserById(String userId) {
        try {
            Optional<User> userEntityOptional = userRepository.findByUserId(userId);

            if (userEntityOptional.isPresent()) {
                User userEntity = userEntityOptional.get();
                // Delete associated resource skills
                if (userEntity.getUserLoginEntity() != null) {
                    userLoginRepository.delete(userEntity.getUserLoginEntity());
                }
                // Delete the resource
                userRepository.delete(userEntity);

                ResultResponse result = new ResultResponse();
                log.info("User deletion is successful for userId: " + userId);
                result.setResult("User deleted is successful.....");

                return ResponseEntity.ok(result);
            } else {
                log.warn("The User not found with "+userId);
                throw new NotFoundException(HttpStatus.NOT_FOUND, "The User with " + userId + " not found");
            }
        } catch (Exceptions ex) {
            log.warn("An error occured while deleting the User "+userId);
            throw new NotFoundException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while deleting the User "+userId);
        }
    }
}
