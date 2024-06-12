package com.pbt.ems.repository;

import com.pbt.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserId(String userId);

    Optional<User> findByUserName(String userName);

    Optional<User> findByEmailId(String emailId);
}
