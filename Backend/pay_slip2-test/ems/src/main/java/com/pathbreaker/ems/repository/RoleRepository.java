package com.pathbreaker.payslip.repository;

import com.pathbreaker.payslip.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {



    Optional<Role> findByRoleIgnoreCase(String role);
}
