package com.pb.employee.exception;

public enum EmployeeErrorMessageKey {

    /**
     * All storage device error keys
     */

    INVALID_CREDENTIALS("invalid.credentials"),
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
    EMPLOYEE_ID_ALREADY_EXISTS("employee.id.already.exists"),
    EMPLOYEE_EMAILID_ALREADY_EXISTS("employee.emailid.already.exists"),
    UNABLE_SAVE_EMPLOYEE("unable.save.employee"),
    UNABLE_DELETE_EMPLOYEE("unable.delete.employee"),

    UNABLE_GET_EMPLOYEES("unable.get.employee"),
    DEPARTMENT_ID_ALREADY_EXISTS("department.id.already.exists"),
    INVALID_DEPARTMENT("invalid.department"),
    UNABLE_SAVE_DEPARTMENT("unable.save.department"),
    UNABLE_GET_DEPARTMENT("unable.get.department"),
    DESIGNATION_ID_ALREADY_EXISTS("designation.id.already.exists"),
    INVALID_DESIGNATION("invalid.designation"),
    UNABLE_SAVE_DESIGNATION("unable.save.designation"),
    UNABLE_GET_DESIGNATION("unable.get.designation")
    ;


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