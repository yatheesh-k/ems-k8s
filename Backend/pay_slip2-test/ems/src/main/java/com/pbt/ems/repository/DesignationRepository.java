package com.pbt.ems.repository;

import com.pbt.ems.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Integer> {


    Optional<Designation> findByDesignationTitleIgnoreCase(String designationTitle);
}
