package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.request.UserRequest;
import com.pathbreaker.payslip.request.UserUpdateRequest;
import com.pathbreaker.payslip.response.UserResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    ResponseEntity<?> createUser(String companyId,UserRequest userRequest);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(String userId);

    ResponseEntity<?> updateUserById(String userId, UserUpdateRequest userUpdateRequest);

    ResponseEntity<?> deleteUserById(String userId);
}
