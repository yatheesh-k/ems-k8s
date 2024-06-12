package com.pbt.ems.serviceImpl;

import com.pbt.ems.entity.Attendance;
import com.pbt.ems.entity.Employee;
import com.pbt.ems.exceptions.BaseException;
import com.pbt.ems.mappers.AttendanceMapper;
import com.pbt.ems.repository.AttendanceRepository;
import com.pbt.ems.repository.EmployeeRepository;
import com.pbt.ems.request.AttendanceRequest;
import com.pbt.ems.response.AttendanceResponse;
import com.pbt.ems.response.ResultResponse;
import com.pbt.ems.service.AttendanceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    public AttendanceServiceImpl(EmployeeRepository employeeRepository,
                                 AttendanceRepository attendanceRepository,
                                 AttendanceMapper attendanceMapper){
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.attendanceMapper = attendanceMapper;
    }
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final AttendanceMapper attendanceMapper;

    public String generateAttendanceId() {
        String attendanceId = attendanceRepository.findHighestAttendanceId();
        int numericPart = 1;

        if (attendanceId != null) {
            numericPart = Integer.parseInt(attendanceId.substring(3)) + 1;
        }
        String idFormat = "AT%03d";
        System.out.println("the id is :" + String.format(idFormat,numericPart));
        return String.format(idFormat, numericPart);

    }
    @Override
    public ResponseEntity<?> addAttendance(String employeeId, AttendanceRequest attendanceRequest) {
        try {
            // Check if the company exists
            Optional<Employee> employeeOptional = employeeRepository.findByEmployeeId(employeeId);
            if (employeeOptional.isEmpty()) {
                log.warn("Employee with Id '{}' not found.", employeeId);
                throw new BaseException(HttpStatus.BAD_REQUEST, "The Employee is not found");
            }
            // Check if attendance already exists for the given month and year
            List<Attendance> existingAttendance = attendanceRepository.findByEmployeeAndMonthAndYear(employeeOptional.get(), attendanceRequest.getMonth(), attendanceRequest.getYear());
            if (!existingAttendance.isEmpty()) {
                log.warn("Attendance already exists for employee '{}' for month '{}' and year '{}'", employeeId, attendanceRequest.getMonth(), attendanceRequest.getYear());
                throw new BaseException(HttpStatus.CONFLICT, "Attendance already exists for the given month and year of the employee "+employeeId);
            }
            // If the employee with the same name doesn't exist, proceed with saving
            Attendance attendance = attendanceMapper.entityToRequest(attendanceRequest);
            attendance.setAttendanceId(generateAttendanceId());
            attendance.setEmployee(employeeOptional.get());
            attendanceRepository.save(attendance);

            ResultResponse result = new ResultResponse();
            log.info("Attendance added successful for employee ",employeeId );
            result.setResult("Attendance added successful for employee " +employeeId);

            return ResponseEntity.ok(result);
        } catch (BaseException ex) {
            String message = "An error occurred during Adding the attendance to the employee " + ex;
            log.error(message);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, message);
        }
    }

    @Override
    public List<AttendanceResponse> getAllAttendance(){
        List<Attendance> attendanceList = attendanceRepository.findAll();

        List<AttendanceResponse> attendanceResponses = attendanceList.stream()
                .map(attendanceMapper::responseToEntity)
                .collect(Collectors.toList());

        log.info("The retrieved Attendance details are : {} " ,attendanceResponses.size());

        return attendanceResponses;
    }

    @Override
    public List<AttendanceResponse> getAttendanceByEmployeeId(String employeeId) {
        try {
            // Assuming there's a method to get Employee by their ID string
            Optional<Employee> employee = employeeRepository.findByEmployeeId(employeeId);
            if (employee.isEmpty()) {
                throw new BaseException(HttpStatus.NOT_FOUND, "The Employee with ID " + employeeId + " not found");
            }
            List<Attendance> attendances = attendanceRepository.findByEmployee(employee.get());

            if (!attendances.isEmpty()) {
                List<AttendanceResponse> response = attendances.stream()
                                .map(attendance -> attendanceMapper.responseToEntity(attendance))
                                .collect(Collectors.toList());

                log.info("Retrieving the Attendance details of employee {}: " ,employeeId);
                return response;
            } else {
                throw new BaseException(HttpStatus.NOT_FOUND, "The Employee with " + employeeId + " not found");
            }
        } catch (BaseException ex) {
            // Handle other exceptions
            log.error("An error occurred while retrieving employee by ID: " + employeeId, ex);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR,"An error occurred while retrieving employee by ID: " + employeeId);
        }
    }
    @Override
    public ResponseEntity<?> updateAttendanceById(String attendanceId, AttendanceRequest attendanceRequest) {
        try {
            Optional<Attendance> attendanceOptional = attendanceRepository.findById(attendanceId);

            if (attendanceOptional.isPresent()) {
                Attendance attendanceEntity = attendanceOptional.get();

                // Update the existing resource with the new data from the request
                Attendance attendance = attendanceMapper.updateEntityFromRequest(attendanceRequest, attendanceEntity);

                // Save the updated resource to the database
                attendanceRepository.save(attendance);

                ResultResponse result = new ResultResponse();
                log.info("Attendance update is successful for attendanceId: {}",attendanceId);
                result.setResult("Attendance update is successful for attendanceId : "+attendanceId);

                return ResponseEntity.ok(result);
            } else {
                log.warn("The Attendance not found with id: {}" , attendanceId);
                throw new BaseException(HttpStatus.NOT_FOUND, "The Attendance with " + attendanceId + " not found");
            }
        } catch (BaseException ex) {
            log.warn("An error occured while updating the Attendance : {}",attendanceId);
            throw new BaseException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while updating the Attendance " +attendanceId);
        }
    }

}
