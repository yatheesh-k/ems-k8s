package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserId(String userId);

    Optional<User> findByUserName(String userName);

    Optional<User> findByEmailId(String emailId);
}
