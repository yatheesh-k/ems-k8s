package com.pb.employee.controller;


import com.pb.employee.exception.EmployeeException;
import com.pb.employee.request.AttendanceRequest;
import com.pb.employee.request.CompanyImageUpdate;
import com.pb.employee.service.AttendanceService;
import com.pb.employee.util.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("")
public class AttendanceController {
    @Autowired
    private AttendanceService attendanceService;
    @RequestMapping(value = "{company}/employee/attendance", method = RequestMethod.POST,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(security = { @SecurityRequirement(name = Constants.AUTH_KEY) },
            summary = "${api.attendance.company.tag}", description = "${api.attendance.company.description}")
    @ResponseStatus(HttpStatus.CREATED)
    @ApiResponse(responseCode = "201", description= "CREATED")
    public ResponseEntity<?> addAttendanceOfEmployees(
            @Parameter(hidden = true, required = true, description = "${apiAuthToken.description}", example = "Bearer abcdef12-1234-1234-1234-abcdefabcdef")
            @RequestHeader(Constants.AUTH_KEY) String authToken,
            @Parameter(required = true, description = "${api.attendance.Payload.description}")
            @RequestParam("file") MultipartFile file,
            @PathVariable String company) throws EmployeeException {
        return attendanceService.uploadAttendanceFile(file,company);
    }

}
