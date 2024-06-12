package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Department;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.DepartmentMapper;
import com.pbt.ems.repository.DepartmentRepository;
import com.pbt.ems.request.DepartmentRequest;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.service.DepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class DepartmentServiceImpl implements DepartmentService {


    private DepartmentServiceImpl(DepartmentMapper departmentMapper,
                                  DepartmentRepository departmentRepository){
        this.departmentMapper  = departmentMapper;
        this.departmentRepository =departmentRepository;
    }
    private final DepartmentMapper departmentMapper;
    private final DepartmentRepository departmentRepository;
    @Override
    public ResponseEntity<?> createDepartment(DepartmentRequest departmentRequest) {
        try {
            Optional<Department> existingDepartment = departmentRepository.findByDepartmentTitleIgnoreCase(departmentRequest.getDepartmentTitle());
            System.out.println(existingDepartment);
            if (existingDepartment.isPresent()) {
                System.out.println(departmentRepository.findByDepartmentTitleIgnoreCase(departmentRequest.getDepartmentTitle()));
                log.warn("Department with name '{}' already exists. Cannot add duplicate department.", departmentRequest.getDepartmentTitle());
                throw new BaseException(HttpStatus.BAD_REQUEST, "Department with the same name already exists.");
            } else {
                Department department = departmentMapper.entityToRequest(departmentRequest);
                // Save the department if it doesn't exist
                departmentRepository.save(department);

                ResultResponse result = new ResultResponse();
                log.info("Department added successfully...");
                result.setResult("Department added successfully...");
                return ResponseEntity.ok(result);
            }
        } catch (BaseException ex) {
            log.warn("An error occurred while adding department");
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while adding department");
        }
    }


    @Override
    public List<Department> getAllDepartments() {
        List<Department> departmentEntities = departmentRepository.findAll();
        log.info("The size of the departments is : "+departmentEntities.size());
        return departmentEntities;
    }

    @Override
    public Optional<Department> getById(int id) {
        try {
        Optional<Department> departmentEntity= departmentRepository.findById(id);
        if (departmentEntity.isPresent()){
            return departmentEntity;
        }
        else {
            log.error("The department with " + id + " not found");
            throw new BaseException(HttpStatus.NOT_FOUND, "The department with " + id + " not found");
        }
    } catch (BaseException ex) {
        // Handle other exceptions
        log.error("An error occurred while retrieving department by ID: " + id, ex);
        throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving department by ID: " + id);
    }
 }

    @Override
    public ResponseEntity<?> updateById(int id, DepartmentRequest departmentRequest) {
        try {
            Optional<Department> departmentEntity = departmentRepository.findById(id);

            if (departmentEntity.isPresent()) {
                Department entity = departmentEntity.get();
                // Update the department title
                entity.setDepartmentTitle(departmentRequest.getDepartmentTitle());
                // Save the updated entity
                departmentRepository.save(entity);

                ResultResponse result = new ResultResponse();
                log.info("Department Updated successfully...");
                result.setResult("Department Updated successfully...");
                return ResponseEntity.ok(result);
            } else {
                log.error("The department with " + id + " not found");
                throw new BaseException(HttpStatus.NOT_FOUND, "The department with " + id + " not found");
            }
        }catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while updating department by ID: " + id, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while updating department by ID: " + id);
        }

    }
    @Override
    public ResponseEntity<?> deleteById(int id) {
        try {
            Optional<Department> departmentEntity = departmentRepository.findById(id);
            if (departmentEntity.isPresent()) {
                Department entity = departmentEntity.get();
                departmentRepository.delete(entity);

                ResultResponse result = new ResultResponse();
                log.info("Department deleted successfully...");
                result.setResult("Department deleted successfully...");
                return ResponseEntity.ok(result);
            } else {
                log.error("The department with " + id + " not found");
                throw new BaseException(HttpStatus.NOT_FOUND, "The department with " + id + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while Deleting department by ID: " + id, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while deleting department by ID: " + id);
        }
    }
}
