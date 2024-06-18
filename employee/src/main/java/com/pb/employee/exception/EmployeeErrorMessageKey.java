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
    UNABLE_TO_CREATE_COMPANY("unable.to.create.index"),
    INVALID_COMPANY("invalid.company"),
    INVALID_EMPLOYEE("invalid.employee"),
    EMPLOYEE_ID_ALREADY_EXISTS("employee.id.already.exists"),
    EMPLOYEE_EMAILID_ALREADY_EXISTS("employee.emailid.already.exists"),
    UNABLE_SAVE_EMPLOYEE("unable.save.employee"),
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
