package com.pbt.ems.service;

import com.pbt.ems.request.RelievingRequest;
import com.pbt.ems.request.RelievingUpdateRequest;
import com.pbt.ems.response.RelievingReponse;
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
