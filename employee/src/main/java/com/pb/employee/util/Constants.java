package com.pb.employee.util;


import org.springframework.stereotype.Component;
import org.springframework.web.util.UriBuilder;

import java.net.URI;
import java.util.function.Function;

@Component
public class Constants {

    public static final String REMOTE_SERVICE_UNAVAILABLE = "Remote service is not available at the moment";;
    public static final String REQUEST_PAYLOAD_INVALID = "Request payload is not valid";
    public static final String REQUEST_UNAUTHORIZED = "Request is unauthorized";
    public static final String REQUEST_RESOURCE_DUPLICATE = "Resource already exists";
    public static final String REQUEST_RESOURCE_NOT_FOUND = "Resource not found";
    public static final String REQUEST_OPERATION_INVALID = "This operation is not allowed";
    public static final String REQUEST_UNABLE_TO_PROCESS = "Remote service is not able to process the request at the moment";
    public static final String RESOURCE_ID = "ResourceId";
    public static final String INDEX_EMS = "ems";
    public static final String EMS_USERNAME = "ems.username";
    public static final String EMS_PASSWORD = "ems.password";
    public static final String EMS_ADMIN = "ems_admin";
    public static final String LOGIN_SUCCESS = "success";
    public static final String COMPANY = "company";
    public static final String ATTENDANCE = "attendance";
    public static final String SALARY = "salary";
    public static final String DEFAULT = "default";
    public static final String TYPE = "type";
    public static final String COMPANY_NAME = "companyName";
    public static final String SHORT_NAME = "shortName";
    public static final String AUTH_KEY = "Authorization";


    public static final String EMPLOYEE_TYPE = "CompanyAdmin";
    public static final String EMPLOYEE_NAME = "EmployeeName";
    public static final String EMPLOYEE = "employee";
    public static final String SUCCESS = "success";

    public static final String EMPLOYEE_ID = "employeeId";
    public static final String EMAIL_ID = "emailId";
    public static final Object DELETED = "deleted";
    public static final String DEPARTMENT = "department";
    public static final String DESIGNATION = "designation";
    public static final String NAME = "name";
    public static final String PAYSLIP = "payslip";
    public static final String FILE = "file";
    public static final String MONTH = "month";
    public static final String YEAR = "year";
    public static final String GENERATE_PAYSLIP = "generatePayslip";
    public static final String EMPLOYEE_WITHOUT_ATTENDANCE = "employeesWithoutAttendance";
    public static final String DUPLICATE_EMPLOYEE_ID = "EmployeeId";
    public static final String DUPLICATE_AADHAAR_ID ="AadhaarId";
    public static final String DUPLICATE_PAN_NO = "PanNo";
    public static final String DUPLICATE_UAN_NO = "UanNo";
    public static final String DUPLICATE_ACCOUNT_NO = "AccountNo";
    public static final String DUPLICATE_CIN_NO = "CinNo";
    public static final String DUPLICATE_REGISTER_NO = "RegisterNo";
    public static final String DUPLICATE_MOBILE_NO = "MobileNo";
    public static final String DUPLICATE_LAND_NO = "LandNo";
    public static final String DUPLICATE_GST_NO = "GstNo";
    public static final String DUPLICATE_PERSONAL_MAIL = "PersonalMailId";
    public static final String DUPLICATE_PERSONAL_MOBILE = "PersonalMobileNo";
    public static final String KEYWORD = ".keyword";
    public static final String EMS_ADMIN_LOGIN = "/emsadmin/login";
    public static final String TOKEN_VALIDATE ="/token/validate" ;
    public static final String COMPANY_LOGIN = "/company/login";
    public static final String VALIDATE = "/validate";
    public static final String FORGOT_PASSWORD ="/forgot/password" ;
    public static final String UPDATE_PASSWORD ="/update/password" ;
}