package com.pb.ems.exception;

public enum IdentityErrorMessageKey {

    /**
     * All storage device error keys
     */

    INVALID_CREDENTIALS("invalid.credentials"),
    INVALID_TOKEN("invalid.token"),
    INVALID_USERNAME("invalid.username"),
<<<<<<< HEAD
       ;
=======
    INVALID_OTP("invalid.otp"),
    OTP_EXPIRED("The.Otp.is.expired");
>>>>>>> e997f883 (added the otp and validation)

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
