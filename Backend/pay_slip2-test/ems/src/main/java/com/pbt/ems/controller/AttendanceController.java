package com.pbt.ems.controller;

import com.pbt.ems.request.AttendanceRequest;
import com.pbt.ems.response.AttendanceResponse;
import com.pbt.ems.service.AttendanceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@CrossOrigin(origins="*")
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }
    private final AttendanceService attendanceService;

    @PostMapping("/{employeeId}")
    public ResponseEntity<?> addAttendance(@PathVariable String employeeId,@RequestBody AttendanceRequest attendanceRequest){
        return attendanceService.addAttendance(employeeId,attendanceRequest);
    }

    @GetMapping("/all")
    public List<AttendanceResponse> getAllAttendance(){
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/{employeeId}")
    public List<AttendanceResponse> getAttendanceByEmployeeId(@PathVariable String employeeId){
        return attendanceService.getAttendanceByEmployeeId(employeeId);
    }

    @PutMapping("/{attendanceId}")
    public ResponseEntity<?> updateAttendanceById(@PathVariable String attendanceId, @RequestBody AttendanceRequest attendanceRequest){
        return attendanceService.updateAttendanceById(attendanceId,attendanceRequest);
    }
}
