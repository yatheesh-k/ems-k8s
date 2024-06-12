package com.pbt.ems.repository;

import com.pbt.ems.entity.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {

    SuperAdmin findByEmailId(String emailId);
}
