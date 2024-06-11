package com.pathbreaker.payslip.exception;

import com.pathbreaker.services.filters.exceptions.BaseException;
import lombok.Data;
import org.springframework.http.HttpStatus;

public class NotFoundException extends BaseException {

    public NotFoundException(HttpStatus httpStatus, String message) {
        super(httpStatus, message);
    }
}
