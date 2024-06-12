package com.pbt.ems.service;

import com.pbt.ems.request.AttendanceRequest;
import com.pbt.ems.response.AttendanceResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AttendanceService {

    ResponseEntity<?> addAttendance(String employeeId, AttendanceRequest attendanceRequest);

    List<AttendanceResponse> getAllAttendance();

    List<AttendanceResponse> getAttendanceByEmployeeId(String employeeId);

    ResponseEntity<?> updateAttendanceById(String attendanceId, AttendanceRequest attendanceRequest);

}
