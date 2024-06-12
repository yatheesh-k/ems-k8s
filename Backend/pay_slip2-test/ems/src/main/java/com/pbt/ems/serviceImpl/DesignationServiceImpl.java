package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Designation;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.DesignationMapper;
import com.pbt.ems.repository.DesignationRepository;
import com.pbt.ems.request.DesignationRequest;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.service.DesignationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class DesignationServiceImpl implements DesignationService {
    @Autowired
    private DesignationServiceImpl(DesignationMapper designationMapper,
                                  DesignationRepository designationRepository){
        this.designationMapper  = designationMapper;
        this.designationRepository =designationRepository;
    }
    private final DesignationMapper designationMapper;
    private final DesignationRepository designationRepository;


    @Override
    public ResponseEntity<?> createDesignation(DesignationRequest designationRequest) {
        try {
            Optional<Designation> existingDesignation = designationRepository.findByDesignationTitleIgnoreCase(designationRequest.getDesignationTitle());
            System.out.println(existingDesignation);
            if (existingDesignation.isPresent()) {
                log.warn("Designation with name '{}' already exists. Cannot add duplicate designation.", designationRequest.getDesignationTitle());
                throw new BaseException(HttpStatus.BAD_REQUEST, "Designation with the same name already exists.");
            } else {
                // Create a new designation entity and save it
                Designation newDesignation = designationMapper.entityToRequest(designationRequest);
                designationRepository.save(newDesignation);
            }

            ResultResponse result = new ResultResponse();
            log.info("Designation added successfully...");
            result.setResult("Designation added successfully...");
            return ResponseEntity.ok(result);
        } catch (BaseException ex) {
            log.error("An error occurred while adding Designation", ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while adding Designation");
        }
    }


    @Override
    public List<Designation> getAllDesignation() {
        List<Designation> designationEntities = designationRepository.findAll();
        return designationEntities;
    }

    @Override
    public Optional<Designation> getById(int id) {
        try {
            Optional<Designation> designationEntity= designationRepository.findById(id);
            if (designationEntity.isPresent()){
                return designationEntity;
            }
            else {
                log.error("The Designation with " + id + " not found");
                throw new BaseException(HttpStatus.NOT_FOUND, "The Designation with " + id + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while retrieving Designation by ID: " + id, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving Designation by ID: " + id);
        }
    }

    @Override
    public ResponseEntity<?> updateById(int id, DesignationRequest designationRequest) {
        try {
            Optional<Designation> designationEntity = designationRepository.findById(id);

            if (designationEntity.isPresent()) {
                Designation entity = designationEntity.get();
                // Update the department title
                entity.setDesignationTitle(designationRequest.getDesignationTitle());
                // Save the updated entity
                designationRepository.save(entity);

                ResultResponse result = new ResultResponse();
                log.info("Designation Updated successfully...");
                result.setResult("Designation Updated successfully...");
                return ResponseEntity.ok(result);
            } else {
                log.error("The Designation with " + id + " not found");
                throw new BaseException(HttpStatus.NOT_FOUND, "The Designation with " + id + " not found");
            }
        }catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while updating Designation by ID: " + id, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while updating Designation by ID: " + id);
        }

    }
    @Override
    public ResponseEntity<?> deleteById(int id) {
        try {
            Optional<Designation> designationEntity = designationRepository.findById(id);
            if (designationEntity.isPresent()) {
                Designation entity = designationEntity.get();
                designationRepository.delete(entity);

                ResultResponse result = new ResultResponse();
                log.info("Designation deleted successfully...");
                result.setResult("Designation deleted successfully...");
                return ResponseEntity.ok(result);
            } else {
                log.error("The Designation with " + id + " not found");
                throw new BaseException(HttpStatus.NOT_FOUND, "The Designation with " + id + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while Deleting Designation by ID: " + id, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting Designation by ID: " + id);
        }
    }
}
