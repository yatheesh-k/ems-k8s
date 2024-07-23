
package com.pb.employee.serviceImpl;


import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.common.ResponseObject;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.AttendanceUpdateRequest;
import org.apache.poi.ss.usermodel.*;
import com.pb.employee.request.AttendanceRequest;
import com.pb.employee.service.AttendanceService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.util.StringUtils;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Override
    public ResponseEntity<?> uploadAttendanceFile(String company,MultipartFile file) throws EmployeeException {
        if (file.isEmpty()) {
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.EMPTY_FILE), HttpStatus.BAD_REQUEST);
        }
        try {
            List<AttendanceRequest> attendanceRequests = parseExcelFile(file, company);
            for (AttendanceRequest attendanceRequest : attendanceRequests) {
                addAttendanceOfEmployees(attendanceRequest);
            }
        } catch (Exception e) {
            log.error("Error processing the uploaded file: {}", e.getMessage(), e);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.FAILED_TO_PROCESS), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        log.debug("The attendance added successfully...");
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<?> getAllEmployeeAttendance(String companyName, String employeeId, String month, String year) throws EmployeeException {
        List<AttendanceEntity> attendanceEntities = null;
        String index = ResourceIdUtils.generateCompanyIndex(companyName);

        try {
            // Fetch the actual employeeId from the database based on the generatedEmployeeId
            EmployeeEntity employee = openSearchOperations.getEmployeeById(employeeId,null,index);

            // Check if employee exists
            if (employee == null) {
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.NOT_FOUND);
            }
            // Call the method to get attendance based on whether the month is provided or not
            if ((month != null && !month.isEmpty())||(year!= null && !year.isEmpty())) {
                attendanceEntities = openSearchOperations.getAttendanceByMonthAndYear(companyName,employeeId, month, year);
            }
            // Unmask sensitive properties if required
            for (AttendanceEntity attendanceEntity : attendanceEntities) {
                CompanyUtils.unMaskAttendanceProperties(attendanceEntity);
            }
            // Return success response with the retrieved attendance records
            return new ResponseEntity<>(ResponseBuilder.builder().build().createSuccessResponse(attendanceEntities), HttpStatus.OK);

        } catch (Exception ex) {
            log.error("Exception while fetching attendance for employees {}: {}", companyName, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_GET_ATTENDANCE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> deleteEmployeeAttendanceById(String companyName, String employeeId, String attendanceId) throws EmployeeException {
        String index = ResourceIdUtils.generateCompanyIndex(companyName);
        AttendanceEntity entity = null;
        try {
            entity = openSearchOperations.getAttendanceById(attendanceId, null, index);
            if (entity==null){
                log.error("Exception while fetching employee for the attendance {}", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!entity.getEmployeeId().equals(employeeId)) {
                log.error("Employee ID mismatch for attendance {}: expected {}, found", attendanceId, employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            openSearchOperations.deleteEntity(attendanceId, index);
        }
        catch (Exception ex) {
            log.error("Exception while deleting attendance for employees {}: {}", attendanceId, ex.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_ATTENDANCE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.DELETED), HttpStatus.OK);

    }

    @Override
    public ResponseEntity<?> updateEmployeeAttendanceById(String company, String employeeId, String attendanceId, AttendanceUpdateRequest updateRequest) throws EmployeeException{
        String index = ResourceIdUtils.generateCompanyIndex(company);
        AttendanceEntity entity = null;
        try {
            entity = openSearchOperations.getAttendanceById(attendanceId, null, index);
            if (entity==null){
                log.error("Exception while fetching employee for attendance {}", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_ATTENDANCE),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            if (!entity.getEmployeeId().equals(employeeId)) {
                log.error("Employee ID mismatch for attendance details {}: expected {}, found", attendanceId, employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception ex) {
            log.error("Exception while fetching user {}:", employeeId, ex);
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES_ATTENDANCE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Entity employeeAttendance = CompanyUtils.maskAttendanceUpdateProperties(updateRequest, entity);
        openSearchOperations.saveEntity(employeeAttendance, attendanceId, index);
        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.OK);
    }
    private List<AttendanceRequest> parseExcelFile(MultipartFile file, String company) throws Exception {
        List<AttendanceRequest> attendanceRequests = new ArrayList<>();
        String fileName = file.getOriginalFilename();

        if (fileName != null && (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))) {
            try (InputStream excelIs = file.getInputStream()) {
                log.info("Successfully opened input stream for file: {}", fileName);

                Workbook wb = null;
                try {
                    wb = new XSSFWorkbook(excelIs);
                } catch (Exception e) {
                    log.error("Failed to create workbook for file: {}", e.getMessage(), e);
                    throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.FAILED_TO_CREATE), HttpStatus.INTERNAL_SERVER_ERROR);
                }

                Sheet sheet = wb.getSheetAt(0);
                log.info("Successfully retrieved sheet: '{}', with {} rows.", sheet.getSheetName(), sheet.getPhysicalNumberOfRows());

                Iterator<Row> rowIt = sheet.rowIterator();

                if (!rowIt.hasNext()) {
                    log.warn("No rows found in the sheet '{}'", sheet.getSheetName());
                }
                while (rowIt.hasNext()) {
                    Row currentRow = rowIt.next();
                    log.info("Processing row number: {}", currentRow.getRowNum());

                    if (currentRow.getRowNum() == 0) {
                        log.info("Skipping header row.");
                        continue;
                    }

                    if (StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(0)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(1)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(2)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(3)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(4)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(5)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(6)))
                            || StringUtils.isEmptyOrWhitespace(getCellValue(currentRow.getCell(7)))) {
                        log.warn("Skipping row {} as one or more critical cells are empty", currentRow.getRowNum());
                        continue;
                    }

                    AttendanceRequest attendanceRequest = new AttendanceRequest();
                    attendanceRequest.setCompany(company);
                    attendanceRequest.setEmployeeId(getCellValue(currentRow.getCell(0)));
                    attendanceRequest.setMonth(getCellValue(currentRow.getCell(1)));
                    attendanceRequest.setFirstName(getCellValue(currentRow.getCell(5)));
                    attendanceRequest.setLastName(getCellValue(currentRow.getCell(6)));
                    attendanceRequest.setEmailId(getCellValue(currentRow.getCell(7)));

                    // Handle parsing and setting year, totalWorkingDays, and noOfWorkingDays
                    try {
                        attendanceRequest.setYear(String.valueOf((int) Double.parseDouble(getCellValue(currentRow.getCell(2)))));
                        attendanceRequest.setTotalWorkingDays(String.valueOf((int) Double.parseDouble(getCellValue(currentRow.getCell(3)))));
                        attendanceRequest.setNoOfWorkingDays(String.valueOf((int) Double.parseDouble(getCellValue(currentRow.getCell(4)))));
                    } catch (NumberFormatException e) {
                        log.error("Error parsing numeric values from row {}: {}", currentRow.getRowNum(), e.getMessage());
                        throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.NUMBER_EXCEPTION), HttpStatus.INTERNAL_SERVER_ERROR);
                    }

                    attendanceRequests.add(attendanceRequest);

                    log.info("Added attendance request for employee ID: {}", attendanceRequest.getEmployeeId());
                }
                wb.close();
            } catch (IOException e) {
                log.error("Failed to process file: {}", e.getMessage(), e);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.FAILED_TO_PROCESS), HttpStatus.CONFLICT);
            }
        } else {
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.INVALID_FORMAT), HttpStatus.BAD_REQUEST);
        }
        return attendanceRequests;
    }


    private String getCellValue(Cell cell) {
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                } else {
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
    private ResponseEntity<?> addAttendanceOfEmployees(AttendanceRequest attendanceRequest) throws EmployeeException {
        log.debug("Attendance adding method is started ..");
        String index = ResourceIdUtils.generateCompanyIndex(attendanceRequest.getCompany());
        String employeeId = ResourceIdUtils.generateEmployeeResourceId(attendanceRequest.getEmailId());
        EmployeeEntity employee = null;
        try {
            employee = openSearchOperations.getEmployeeById(employeeId, null, index);
            if (employee ==  null){
                log.error("The employee details are not found {}", employeeId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_GET_EMPLOYEES),
                        HttpStatus.NOT_FOUND);
            }
        }catch (Exception exception) {
            log.error("Unable to save the employee attendance details {} {}", attendanceRequest.getType(), exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_SAVE_ATTENDANCE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String attendanceId = ResourceIdUtils.generateAttendanceId(attendanceRequest.getCompany(),employee.getId(),attendanceRequest.getYear(),attendanceRequest.getMonth());
        Object object = null;

        try {
            object = openSearchOperations.getById(attendanceId, null, index);
            if (object != null) {
                log.error("The Attendance Id already exists {}", attendanceId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.ATTENDANCE_ALREADY_EXISTS),
                        HttpStatus.NOT_ACCEPTABLE);
            }
            // Create a new AttendanceEntity
            Entity attendanceEntity = CompanyUtils.maskAttendanceProperties(attendanceRequest, attendanceId, employeeId);

            // Save the attendance entity
            openSearchOperations.saveEntity(attendanceEntity, attendanceId, index);

        } catch (Exception exception) {
            log.error("Unable to save the employee attendance details {} {}", attendanceRequest.getType(), exception.getMessage());
            throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.UNABLE_TO_SAVE_ATTENDANCE),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new ResponseEntity<>(
                ResponseBuilder.builder().build().createSuccessResponse(Constants.SUCCESS), HttpStatus.CREATED);
    }

}