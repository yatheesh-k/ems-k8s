package com.pb.ems.exception;

public enum IdentityErrorMessageKey {

    /**
     * All storage device error keys
     */

    INVALID_CREDENTIALS("invalid.credentials"),
    INVALID_TOKEN("invalid.token"),
    INVALID_USERNAME("invalid.username"),
    INVALID_OTP("invalid.otp"),
    OTP_EXPIRED("otp.expired"),
    USER_NOT_FOUND("user.not.found"),
    INVALID_RESOURCE_TYPE("resource.type.invalid"),
    INVALID_OTP_FORMAT("invalid.otp.format"),
    USED_PASSWORD("user.password");


    private final String key;

    IdentityErrorMessageKey(String keyVal) {
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
