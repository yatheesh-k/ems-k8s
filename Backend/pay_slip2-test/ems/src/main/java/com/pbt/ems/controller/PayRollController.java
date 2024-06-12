package com.pbt.ems.controller;

import com.pbt.ems.request.*;
import com.pbt.ems.response.PayRollResponse;
import com.pbt.ems.service.PayRollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
