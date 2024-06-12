package com.pbt.ems.controller;

import com.pbt.ems.request.EmployeeRequest;
import com.pbt.ems.request.EmployeeUpdateRequest;
import com.pbt.ems.response.EmployeeResponse;
import com.pbt.ems.service.EmployeeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/employee")
public class EmployeeController {

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
    private final EmployeeService employeeService;

    @PostMapping("/{companyId}")
    public ResponseEntity<?> createEmployee(@PathVariable String companyId,@RequestBody EmployeeRequest employeeRequest){
        return  employeeService.createEmployee(companyId,employeeRequest);
    }
    @GetMapping("/all")
    public List<EmployeeResponse> getAllEmployees(){
        return employeeService.getAllEmployees();
    }
    @GetMapping("/{employeeId}")
    public  EmployeeResponse getEmployeeById(@PathVariable String employeeId){
        return employeeService.getEmployeeById(employeeId);
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<?> updateEmployeeById(@PathVariable String employeeId,@RequestBody EmployeeUpdateRequest employeeUpdateRequest){
        return employeeService.updateEmployeeById(employeeId,employeeUpdateRequest);
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<?> deleteEmployeeById(@PathVariable String employeeId){
        return employeeService.deleteEmployeeById(employeeId);
    }

}
