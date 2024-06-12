package com.pbt.ems.service;

import com.pbt.ems.request.UserRequest;
import com.pbt.ems.request.UserUpdateRequest;
import com.pbt.ems.response.UserResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    ResponseEntity<?> createUser(String companyId, UserRequest userRequest);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(String userId);

    ResponseEntity<?> updateUserById(String userId, UserUpdateRequest userUpdateRequest);

    ResponseEntity<?> deleteUserById(String userId);
}
