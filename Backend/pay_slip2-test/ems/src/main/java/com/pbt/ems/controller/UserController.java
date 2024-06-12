package com.pbt.ems.controller;

import com.pbt.ems.request.UserRequest;
import com.pbt.ems.request.UserUpdateRequest;
import com.pbt.ems.response.UserResponse;
import com.pbt.ems.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createUser(@PathVariable String companyId,@RequestBody UserRequest userRequest){
        return  userService.createUser(companyId,userRequest);
    }
    @GetMapping("/all")
    public List<UserResponse> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping("/{userId}")
    public  UserResponse getUserById(@PathVariable String userId){
        return userService.getUserById(userId);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserById(@PathVariable String userId,@RequestBody UserUpdateRequest userUpdateRequest){
        return userService.updateUserById(userId,userUpdateRequest);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUserById(@PathVariable String userId){
        return userService.deleteUserById(userId);
    }
}
