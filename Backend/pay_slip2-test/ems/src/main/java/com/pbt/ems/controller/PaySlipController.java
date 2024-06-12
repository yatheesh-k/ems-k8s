package com.pbt.ems.controller;

import com.pbt.ems.request.PaySlipsRequest;
import com.pbt.ems.response.EmployeeSalaryResponse;
import com.pbt.ems.response.PaySlipsResponse;
import com.pbt.ems.service.PaySlipService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/payslip")
public class PaySlipController {

    @Autowired
    private PaySlipService paySlipService;

    @GetMapping("/company/{companyId}")
    public List<PaySlipsResponse> getPayslipByCompanyId(@PathVariable String companyId){
      return paySlipService.getPayslipByCompanyId(companyId);
   }
    @GetMapping("/{employeeId}")
    public List<PaySlipsResponse> getByEmployeeId(@PathVariable String employeeId){
        return paySlipService.getByEmployeeId(employeeId);
    }
    @PostMapping("/employee/{companyId}")
    public ResponseEntity<List<EmployeeSalaryResponse>> getByEmployeeDetails(@PathVariable String companyId, @RequestBody PaySlipsRequest paySlipsRequest)throws IOException{
        return paySlipService.getByEmployeeDetails(companyId,paySlipsRequest);
    }
    @PostMapping("/{companyId}/{employeeId}")
    public ResponseEntity<?> generatePayslip(@PathVariable String companyId, @PathVariable String employeeId,@RequestBody PaySlipsRequest paySlipsRequest)throws IOException {
        return paySlipService.generatePayslip(companyId,employeeId,paySlipsRequest);
    }
    @GetMapping("/download/{payslipId}")
    public ResponseEntity<byte[]> getPayslipById(@PathVariable Long payslipId,HttpServletRequest request) throws IOException{
        return paySlipService.getPayslipById(payslipId,request);
    }
    @GetMapping("/view/{payslipId}")
    public ResponseEntity<byte[]> ViewPayslipById(@PathVariable Long payslipId){
        return paySlipService.ViewPayslipById(payslipId);
    }

}
