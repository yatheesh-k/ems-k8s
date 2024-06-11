package com.pathbreaker.payslip.controller;

import com.pathbreaker.payslip.entity.Designation;
import com.pathbreaker.payslip.request.*;
import com.pathbreaker.payslip.response.EmployeeResponse;
import com.pathbreaker.payslip.response.PayRollResponse;
import com.pathbreaker.payslip.service.PayRollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/payroll")
public class PayRollController {

    @Autowired
    private PayRollService payrollService;


    @PostMapping("/{employeeId}")
    public ResponseEntity<?> createPayroll(@RequestBody PayRollRequest payRollRequest, @PathVariable String employeeId){
        return  payrollService.createPayroll(payRollRequest, employeeId);
    }
    @GetMapping("/all")
    public List<PayRollResponse> getAllPayrolls(){
        return payrollService.getAllPayrolls();
    }
    @GetMapping("/{employeeId}")
    public  List<PayRollResponse> getPayrollByEmployeeId(@PathVariable String employeeId){
        return payrollService.getPayrollByEmployeeId(employeeId);
    }

    @PutMapping("/{payrollId}")
    public ResponseEntity<?> updatePayrollById(@PathVariable String payrollId,@RequestBody PayRollRequest payRollRequest){
        return payrollService.updatePayrollById(payrollId,payRollRequest);
    }

    @DeleteMapping("/{payrollId}")
    public ResponseEntity<?> deletePayrollById(@PathVariable String payrollId){
        return payrollService.deletePayrollById(payrollId);
    }

}
