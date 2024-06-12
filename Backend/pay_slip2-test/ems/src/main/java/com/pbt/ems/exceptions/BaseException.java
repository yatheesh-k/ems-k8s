package com.pbt.ems.exceptions;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class BaseException extends RuntimeException {

    private String status;
    private int code;
    private String message;
    private BaseException(){
    }
    private BaseException(String message){
        super(message);
    }
    // Constructor that takes a message as input
    public BaseException(HttpStatus httpStatus, String message) {
        super(message);
        this.status = httpStatus.name();
        this.code = httpStatus.value();
        this.message = message;
    }
}
