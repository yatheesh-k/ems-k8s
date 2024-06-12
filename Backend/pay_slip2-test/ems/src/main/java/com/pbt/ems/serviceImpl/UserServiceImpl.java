package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Company;
import com.pbt.ems.entity.User;
import com.pbt.ems.entity.UserLogin;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.UserLoginMapper;
import com.pbt.ems.mappers.UserMapper;
import com.pbt.ems.passwordencrypt.PasswordEncoder;
import com.pbt.ems.repository.CompanyRepository;
import com.pbt.ems.repository.UserLoginRepository;
import com.pbt.ems.repository.UserRepository;
import com.pbt.ems.request.UserRequest;
import com.pbt.ems.request.UserUpdateRequest;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.response.UserResponse;
import com.pbt.ems.service.UserService;
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
                           PasswordEncoder passwordEncoder, CompanyRepository companyRepository, UserMapper userMapper,
                           UserLoginRepository userLoginRepository,
                           UserLoginMapper userLoginMapper){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.companyRepository = companyRepository;
        this.userMapper = userMapper;
        this.userLoginRepository = userLoginRepository;
        this.userLoginMapper = userLoginMapper;
    }
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CompanyRepository companyRepository;
    private final UserMapper userMapper;
    private final UserLoginRepository userLoginRepository;
    private final UserLoginMapper userLoginMapper;
    @Override
    public ResponseEntity<?> createUser(String companyId, UserRequest userRequest) {
        try {
            Optional<Company> companyOptional = companyRepository.findById(companyId);
            Optional<User> existingUser = userRepository.findByUserName(userRequest.getUserName());
            Optional<User> existingUserByEmail = userRepository.findByEmailId(userRequest.getEmailId());

            if (!companyOptional.isPresent()) {
                log.warn("Company with Id '{}' not found.", companyId);
                throw new BaseException(HttpStatus.BAD_REQUEST, "The Company is not found");
            }
                      if (existingUser.isPresent()) {
                log.warn("User with name '{}' already exists. Cannot add duplicate User.", userRequest.getUserName());
                throw new BaseException(HttpStatus.BAD_REQUEST, "User with the same name already exists.");
            }
            if (existingUserByEmail.isPresent()) {
                log.warn("User with emailId '{}' already exists. Cannot add duplicate User.", userRequest.getEmailId());
                throw new BaseException(HttpStatus.BAD_REQUEST, "User with the same emailId already exists.");
            }

            User userEntity = userMapper.entityToRequest(userRequest);
            userEntity.setPassword(passwordEncoder.encryptPassword(userEntity.getPassword()));
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
        } catch (BaseException ex) {
            String message = "An error occurred during User registration " + ex;
            log.error(message);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> userEntities = userRepository.findAll();

        // Prioritize users based on roles: Admin > Manager > Employee
        List<UserResponse> userResponses = userEntities.stream()
                .sorted(Comparator.comparingInt(user -> {
                    user.setPassword(passwordEncoder.decryptPassword(user.getPassword()));

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
                response.setPassword(passwordEncoder.decryptPassword(response.getPassword()));

                log.info("Retrieving the User details of {}: " + userId);
                return response;
            } else {
                throw new BaseException(HttpStatus.NOT_FOUND, "The User with " + userId + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while retrieving User by ID: " + userId, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving User by ID: " + userId);
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
                users.setPassword(passwordEncoder.encryptPassword(users.getPassword()));
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
                throw new BaseException(HttpStatus.NOT_FOUND, "The User with " + userId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occured while updating the USER " + userId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while updating the USER " + userId);
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
                throw new BaseException(HttpStatus.NOT_FOUND, "The User with " + userId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occured while deleting the User "+userId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while deleting the User "+userId);
        }
    }
}
