package com.pb.employee.exception;

public enum EmployeeErrorMessageKey {

    /**
     * All storage device error keys
     */

    INVALID_CREDENTIALS("invalid.credentials"),
    EMPLOYEE_ID_IS_NULL("employee.id.isnull"),
    INVALID_RESOURCE_TYPE("invalid.resource"),
    COMPANY_ALREADY_EXISTS("company.already.exists"),
    COMPANY_SHORT_NAME_ALREADY_EXISTS("company.shortname.already.exists"),
    UNABLE_SAVE_COMPANY("unable.save.company"),
    UNABLE_DELETE_COMPANY("unable.delete.company"),
    UNABLE_GET_COMPANY("unable.get.company"),
    UNABLE_UPLOAD_IMAGE("unable.upload.image"),
    UNABLE_TO_CREATE_COMPANY("unable.to.create.index"),
    INVALID_COMPANY("invalid.company"),
    INVALID_EMPLOYEE("invalid.employee"),
    INVALID_PASSWORD("invalid.password"),
    EMPLOYEE_ID_ALREADY_EXISTS("employee.id.already.exists"),
    EMPLOYEE_EMAILID_ALREADY_EXISTS("employee.emailid.already.exists"),
    UNABLE_SAVE_EMPLOYEE("unable.save.employee"),
    UNABLE_DELETE_EMPLOYEE("unable.delete.employee"),

    UNABLE_GET_EMPLOYEES("unable.get.employee"),
    DEPARTMENT_ID_ALREADY_EXISTS("department.id.already.exists"),
    INVALID_DEPARTMENT("invalid.department"),
    UNABLE_DELETE_DEPARTMENT("unable.delete.department"),
    UNABLE_SAVE_DEPARTMENT("unable.save.department"),
    UNABLE_GET_DEPARTMENT("unable.get.department"),
    DESIGNATION_ID_ALREADY_EXISTS("designation.id.already.exists"),
    INVALID_DESIGNATION("invalid.designation"),
    UNABLE_DELETE_DESIGNATION("unable.delete.designation"),
    UNABLE_SAVE_DESIGNATION("unable.save.designation"),
    UNABLE_GET_DESIGNATION("unable.get.designation"),
    UNABLE_TO_SAVE_SALARY("unable.save.salary"),
    UNABLE_TO_SAVE_ATTENDANCE("unable.save.attendance"),
    UNABLE_GET_EMPLOYEES_SALARY("unable.get.employee.salary"),
    ATTENDANCE_ALREADY_EXISTS("attendance.already.exists"),
    INVALID_FORMAT("invalid.format"),
    FAILED_TO_PROCESS("failed.process"),
    EMPTY_FILE("file.empty"),
    EMPLOYEE_PAYSLIP_ALREADY_EXISTS("employee.payslip.already.exist"),
    EMPLOYEE_NOT_MATCHING("employee.not.matching"),
    UNABLE_GET_EMPLOYEES_PAYSLIP("unable.get.employee.payslip"),
    UNABLE_TO_GET_ATTENDANCE("unable.get.attendance"),
    UNABLE_GET_EMPLOYEES_ATTENDANCE("unable.employee.attendance"),
    UNABLE_TO_GENERATE_PAYSLIP("unable.to.generate.payslip"),
    UNABLE_SAVE_EMPLOYEE_ATTENDANCE("unable.to.save.attendance"),
    FAILED_TO_CREATE("failed.create"),
    EXCEPTION_OCCURRED("exception.occurred"),
    NUMBER_EXCEPTION("number.exception"),
    UNABLE_TO_SEARCH("unable.to.search"),
    FAILED_TO_DELETE("failed.to.delete"),
    EMPLOYEE_NOT_FOUND("employee.not.found"),
    EMPLOYEE_INACTIVE("employee.inactive"),
    INVALID_MONTH_NAME("invalid.month"),
    INVALID_NO_OF_WORKING_DAYS("invalid.working.days"),
    INVALID_ATTENDANCE_DATA("invalid.attendance.data");

    private final String key;

    EmployeeErrorMessageKey(String keyVal) {
        key = keyVal;
    }

    public String getStatusCode() {
        return key;
    }

    @Override
    public String toString() {
        return key;
    }
}