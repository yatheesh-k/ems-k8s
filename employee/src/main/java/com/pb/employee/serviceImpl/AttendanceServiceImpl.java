
package com.pb.employee.serviceImpl;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.common.ResponseBuilder;
import com.pb.employee.exception.EmployeeErrorMessageKey;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.exception.ErrorMessageHandler;
import com.pb.employee.opensearch.OpenSearchOperations;
import com.pb.employee.persistance.model.Entity;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.pb.employee.request.AttendanceRequest;
import com.pb.employee.request.EmployeeUpdateRequest;
import com.pb.employee.service.AttendanceService;
import com.pb.employee.util.CompanyUtils;
import com.pb.employee.util.Constants;
import com.pb.employee.util.ResourceIdUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@Slf4j
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private OpenSearchOperations openSearchOperations;
    @Autowired
    private SalaryServiceImpl salaryService;

    @Override
    public ResponseEntity<?> uploadAttendanceFile(MultipartFile file, String company) throws EmployeeException {
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

    private List<AttendanceRequest> parseExcelFile(MultipartFile file, String company) throws Exception {
        List<AttendanceRequest> attendanceRequests = new ArrayList<>();
        String fileName = file.getOriginalFilename();

        if (fileName != null && (fileName.endsWith(".xls") || fileName.endsWith(".xlsx"))) {
            try (InputStream excelIs = file.getInputStream()) {
                Workbook wb = WorkbookFactory.create(excelIs);
                Sheet sheet = wb.getSheetAt(0);

                log.info("Sheet '{}' has {} rows.", sheet.getSheetName(), sheet.getPhysicalNumberOfRows());

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

                    AttendanceRequest attendanceRequest = new AttendanceRequest();
                    attendanceRequest.setCompany(company);
                    attendanceRequest.setEmployeeId(getCellValue(currentRow.getCell(0)));
                    attendanceRequest.setMonth(getCellValue(currentRow.getCell(1)));
                    attendanceRequest.setYear(getCellValue(currentRow.getCell(2)));
                    attendanceRequest.setTotalWorkingDays(getCellValue(currentRow.getCell(3)));
                    attendanceRequest.setNoOfWorkingDays(getCellValue(currentRow.getCell(4)));

                    attendanceRequests.add(attendanceRequest);

                    log.info("Added attendance request for employee ID: {}", attendanceRequest.getEmployeeId());
                }
                wb.close();
            } catch (IOException e) {
                log.error("Failed to process file: {}", e.getMessage(), e);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.FAILED_TO_PROCESS),HttpStatus.CONFLICT);//"Failed to process file {} ", e
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
            case BLANK:
                return "";
            default:
                return "";
        }
    }
    private ResponseEntity<?> addAttendanceOfEmployees(AttendanceRequest attendanceRequest) throws EmployeeException {
        log.debug("Attendance adding method is started ..");
        String attendanceId = ResourceIdUtils.generateAttendanceId(attendanceRequest.getCompany(),attendanceRequest.getEmployeeId(),attendanceRequest.getYear(),attendanceRequest.getMonth());
        Object object = null;
        String index = ResourceIdUtils.generateCompanyIndex(attendanceRequest.getCompany());

        try {
            object = openSearchOperations.getById(attendanceId, null, index);
            if (object != null) {
                log.error("The Attendance Id already exists {}", attendanceId);
                throw new EmployeeException(ErrorMessageHandler.getMessage(EmployeeErrorMessageKey.ATTENDANCE_ALREADY_EXISTS),
                        HttpStatus.NOT_ACCEPTABLE);
            }
            // Create a new AttendanceEntity
            Entity attendanceEntity = CompanyUtils.maskAttendanceProperties(attendanceRequest, attendanceId, attendanceRequest.getEmployeeId());
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