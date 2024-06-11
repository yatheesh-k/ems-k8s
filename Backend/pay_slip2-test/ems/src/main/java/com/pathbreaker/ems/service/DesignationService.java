package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.entity.Designation;
import com.pathbreaker.payslip.request.DesignationRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface DesignationService {

    ResponseEntity<?> createDesignation(DesignationRequest designationRequest);

    List<Designation> getAllDesignation();

    Optional<Designation> getById(int id);

    ResponseEntity<?> updateById(int id, DesignationRequest designationRequest);

    ResponseEntity<?> deleteById(int id);
}
