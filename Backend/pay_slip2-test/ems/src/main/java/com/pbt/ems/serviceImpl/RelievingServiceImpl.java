package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Employee;
import com.pbt.ems.entity.Relieving;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.RelievingMapper;
import com.pbt.ems.repository.EmployeeRepository;
import com.pbt.ems.repository.RelievingRepository;
import com.pbt.ems.request.RelievingRequest;
import com.pbt.ems.request.RelievingUpdateRequest;
import com.pbt.ems.response.RelievingReponse;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.service.RelievingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RelievingServiceImpl implements RelievingService {


    private RelievingServiceImpl(RelievingMapper relievingMapper,
                                 RelievingRepository relievingRepository,
                                 EmployeeRepository employeeRepository){
        this.relievingMapper  = relievingMapper;
        this.relievingRepository =relievingRepository;
        this.employeeRepository =employeeRepository;
    }
    private final RelievingMapper relievingMapper;
    private final RelievingRepository relievingRepository;
    private final EmployeeRepository employeeRepository;
    @Override
    public ResponseEntity<?> createRelieving(RelievingRequest relievingRequest) {

        try {
            Optional<Relieving> existingEmployeeId = relievingRepository.findByEmployeeId(relievingRequest.getEmployeeId());
            System.out.println(existingEmployeeId);
            if (existingEmployeeId.isPresent()) {
                log.warn("Employee with ID {} already exists. Cannot add relieving for an existing employee.", relievingRequest.getEmployeeId());
                throw new BaseException(HttpStatus.NOT_ACCEPTABLE, "Employee with ID " + relievingRequest.getEmployeeId() + " already exists. Cannot add relieving for an existing employee.");
            }
            Relieving relievingEntity = relievingMapper.entityToRequest(relievingRequest);
            relievingRepository.save(relievingEntity);
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(relievingRequest.getEmployeeId());
            if (employeeOptional.isPresent()) {
                Employee employee = employeeOptional.get();
                employee.setStatus(2); // Assuming '2' represents 'Relieved' in your status table
                employeeRepository.save(employee);
            } else {
                log.warn("Employee with ID {} not found.", relievingRequest.getEmployeeId());
            }
            ResultResponse result = new ResultResponse();
            log.info("Relieving added successfully...");
            result.setResult("Relieving added successfully...");
            return ResponseEntity.ok(result);
        }
        catch (BaseException ex){
                log.warn("An error occured while adding Relieving");
                throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while adding Relieving");
        }
    }
    @Override
    public List<RelievingReponse> getAllRelieving() {
        List<RelievingReponse> relievingResponses = new ArrayList<>();
        List<Relieving> relievingEntities = relievingRepository.findAll();

        for (Relieving relieving : relievingEntities) {
            String employeeId = relieving.getEmployeeId();
            // Perform a separate query to get Employee details using employeeId
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(employeeId);
            // Use orElse to provide a default Employee if not found
            Employee employee = employeeOptional.orElse(new Employee());

            RelievingReponse relievingResponse = new RelievingReponse();
            relievingResponse.setEmployeeId(employeeId);
            relievingResponse.setFirstName(employee.getFirstName());
            relievingResponse.setLastName(employee.getLastName());
            relievingResponse.setId(relieving.getId());
            relievingResponse.setDesignation(relieving.getDesignation());
            relievingResponse.setResignationDate(relieving.getResignationDate());
            relievingResponse.setLastWorkingDate(relieving.getLastWorkingDate());
            relievingResponse.setTypeOfEmployement(relieving.getTypeOfEmployement());

            relievingResponses.add(relievingResponse);
        }

        return relievingResponses;
    }

    @Override
    public Optional<RelievingReponse> getRelievingById (String  employeeId) {
        try {
            Optional<Relieving> relievingEntity = relievingRepository.findByEmployeeId(employeeId);

            if (relievingEntity.isPresent()) {

                Relieving relieving = relievingEntity.get();

                // Perform a separate query to get Employee details using employeeId
                Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(relieving.getEmployeeId());
                // Use orElse to provide a default Employee if not found
                Employee employee = employeeOptional.orElse(new Employee());

                RelievingReponse relievingResponse = new RelievingReponse();
                relievingResponse.setEmployeeId(relieving.getEmployeeId());
                relievingResponse.setFirstName(employee.getFirstName());
                relievingResponse.setLastName(employee.getLastName());
                relievingResponse.setId(relieving.getId());
                relievingResponse.setDesignation(relieving.getDesignation());
                relievingResponse.setTypeOfEmployement(relieving.getTypeOfEmployement());
                relievingResponse.setLastWorkingDate(relieving.getLastWorkingDate());
                relievingResponse.setResignationDate(relieving.getResignationDate());

                return Optional.of(relievingResponse);
            }
            else {
            throw new BaseException(HttpStatus.NOT_FOUND, "The Relieving with " + employeeId + " not found");
        }
    } catch (BaseException ex) {
        // Handle other exceptions
        log.error("An error occurred while retrieving Relieving by ID: " + employeeId, ex);
        throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving Relieving by ID: " + employeeId);
    }
 }

    @Override
    public ResponseEntity<?> updateById(String employeeId, RelievingUpdateRequest relievingRequest) {
        try {
            Optional<Relieving> relievingEntity = relievingRepository.findByEmployeeId(employeeId);

            if (relievingEntity.isPresent()) {
                Relieving entity = relievingEntity.get();
                // Update the department title
                Relieving relieving = relievingMapper.updateEntityFromRequest(relievingRequest, entity);
                // Save the updated entity
                relievingRepository.save(relieving);

                ResultResponse result = new ResultResponse();
                log.info("Relieving Updated successfully...");
                result.setResult("Relieving Updated successfully...");
                return ResponseEntity.ok(result);
            } else {
                throw new BaseException(HttpStatus.NOT_FOUND, "The Relieving with " + employeeId + " not found");
            }
        }catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while updating Relieving by ID: " + employeeId, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while updating Relieving by ID: " + employeeId);
        }

    }
    @Override
    public ResponseEntity<?> deleteById(String employeeId) {
        try {
            Optional<Relieving> relieving = relievingRepository.findByEmployeeId(employeeId);
            if (relieving.isPresent()) {
                Relieving entity = relieving.get();
                relievingRepository.delete(entity);

                ResultResponse result = new ResultResponse();
                log.info("Relieving deleted successfully...");
                result.setResult("Relieving deleted successfully...");
                return ResponseEntity.ok(result);
            } else {
                throw new BaseException(HttpStatus.NOT_FOUND, "The Relieving with " + employeeId + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while Deleting Relieving by ID: " + employeeId, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting Relieving by ID: " + employeeId);
        }
    }
}
