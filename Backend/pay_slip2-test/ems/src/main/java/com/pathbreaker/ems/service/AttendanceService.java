package com.pathbreaker.payslip.service;

import com.pathbreaker.payslip.entity.Designation;
import com.pathbreaker.payslip.entity.Employee;
import com.pathbreaker.payslip.request.AttendanceRequest;
import com.pathbreaker.payslip.request.RelievingRequest;
import com.pathbreaker.payslip.request.RelievingUpdateRequest;
import com.pathbreaker.payslip.response.AttendanceResponse;
import com.pathbreaker.payslip.response.RelievingReponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface AttendanceService {

    ResponseEntity<?> addAttendance(String employeeId,AttendanceRequest attendanceRequest);

    List<AttendanceResponse> getAllAttendance();

    List<AttendanceResponse> getAttendanceByEmployeeId(String employeeId);

    ResponseEntity<?> updateAttendanceById(String attendanceId, AttendanceRequest attendanceRequest);

}
