package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.request.RelievingRequest;
import com.pathbreaker.payslip.request.RelievingUpdateRequest;
import com.pathbreaker.payslip.response.RelievingReponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface RelievingService {

    ResponseEntity<?> createRelieving(RelievingRequest relievingRequest);

    List<RelievingReponse> getAllRelieving();

    Optional<RelievingReponse> getRelievingById(String employeeId);

    ResponseEntity<?> updateById(String employeeId, RelievingUpdateRequest relievingRequest);

    ResponseEntity<?> deleteById(String employeeId);
}
