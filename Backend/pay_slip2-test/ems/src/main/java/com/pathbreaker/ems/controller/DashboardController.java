package com.pathbreaker.payslip.controller;

import com.pathbreaker.payslip.entity.Dashboard;
import com.pathbreaker.payslip.service.DashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }
    private final DashboardService dashboardService;


    @GetMapping("/all")
    public List<Dashboard> getEmployees() {
        return dashboardService.getEmployees();
    }


}
