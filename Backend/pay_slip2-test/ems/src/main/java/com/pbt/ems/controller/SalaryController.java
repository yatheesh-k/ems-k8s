package com.pbt.ems.controller;

import com.pbt.ems.request.SalaryRequest;
import com.pbt.ems.response.SalaryResponse;
import com.pbt.ems.service.SalaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/salary")
public class SalaryController {

    @Autowired
    private SalaryService salaryService;

    @PostMapping("/{employeeId}")
    public ResponseEntity<?> addSalary(@PathVariable String employeeId,@RequestBody SalaryRequest salaryRequest){
        return salaryService.addSalary(employeeId,salaryRequest);
    }
    @GetMapping("/all")
    public List<SalaryResponse> getAllSalaries(){
        return salaryService.getAllSalaries();
    }

    @GetMapping("/{employeeId}")
    public SalaryResponse getSalariesByEmpId(@PathVariable String employeeId){
        return salaryService.getSalariesByEmpId(employeeId);
    }
    @PutMapping("/{salaryId}")
    public ResponseEntity<?> updateBySalaryId(@PathVariable String salaryId,@RequestBody SalaryRequest salaryRequest){
        return salaryService.updateBySalaryId(salaryId,salaryRequest);
    }
}
