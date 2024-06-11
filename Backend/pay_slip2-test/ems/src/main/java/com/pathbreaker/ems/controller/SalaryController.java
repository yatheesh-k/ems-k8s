package com.pathbreaker.payslip.controller;

import com.pathbreaker.payslip.entity.Designation;
import com.pathbreaker.payslip.request.DesignationRequest;
import com.pathbreaker.payslip.request.SalaryRequest;
import com.pathbreaker.payslip.response.SalaryResponse;
import com.pathbreaker.payslip.service.DesignationService;
import com.pathbreaker.payslip.service.SalaryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
