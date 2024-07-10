package com.pb.employee.service;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.AttendanceRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface AttendanceService {

    ResponseEntity<?> uploadAttendanceFile(String company,MultipartFile file) throws EmployeeException;
    ResponseEntity<?> getAllEmployeeAttendance(String companyName,String employeeId,String month,String year)throws EmployeeException;

    ResponseEntity<?> deleteEmployeeAttendanceById(String companyName, String employeeId, String attendanceId)throws EmployeeException;

    ResponseEntity<?> updateEmployeeAttendanceById(String company, String employeeId, String attendanceId, AttendanceRequest updateRequest) throws  EmployeeException;
}
