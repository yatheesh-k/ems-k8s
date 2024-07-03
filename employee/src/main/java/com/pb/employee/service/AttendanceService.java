package com.pb.employee.service;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.AttendanceRequest;
import com.pb.employee.request.EmployeeUpdateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface AttendanceService {

    ResponseEntity<?> uploadAttendanceFile(MultipartFile file,String company) throws EmployeeException;

    /*ResponseEntity<?> getEmployeePayslips(String companyName,String employeeId,String salaryId) throws EmployeeException;

    ResponseEntity<?> getEmployeePayslipById(String companyName, String employeeId,String salaryId,String payslipId)throws EmployeeException;

    ResponseEntity<?> updateEmployeePayslipById(String companyName, String employeeId, String companyId,String payslipId,EmployeeUpdateRequest employeeUpdateRequest)throws EmployeeException;

    ResponseEntity<?> deleteEmployeePayslipById(String companyName,String employeeId,String salaryId,String payslipId)throws EmployeeException ;
*/
}
