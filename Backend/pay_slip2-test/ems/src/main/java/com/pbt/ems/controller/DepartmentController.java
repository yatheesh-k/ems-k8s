package com.pbt.ems.controller;

import com.pbt.ems.entity.Department;
import com.pbt.ems.request.DepartmentRequest;
import com.pbt.ems.service.DepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/department")
public class DepartmentController {

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }
    private final DepartmentService departmentService;


    @PostMapping("/add")
    public ResponseEntity<?> createDepartment(@RequestBody DepartmentRequest departmentRequest){
        return departmentService.createDepartment(departmentRequest);
    }

    @GetMapping("/all")
    public List<Department> getAllDepartments(){
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    public Optional<Department> getById(@PathVariable int id){
        return departmentService.getById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateById(@PathVariable int id,@RequestBody DepartmentRequest departmentRequest){
        return departmentService.updateById(id,departmentRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id){
        return departmentService.deleteById(id);
    }
}
