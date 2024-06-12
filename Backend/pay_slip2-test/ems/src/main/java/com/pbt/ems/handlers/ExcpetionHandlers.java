package com.pbt.ems.handlers;

import com.pbt.ems.exceptions.BaseException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;

@ControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ExcpetionHandlers {

        @ExceptionHandler(value = {Exception.class})
        public ResponseEntity<?> handleConflict(Exception ex, HttpServletRequest request) {
            ex.printStackTrace();

            System.out.println("request path = "+request.getServletPath());
            if (ex instanceof BaseException) {
                BaseException baseException = (BaseException) ex;
                String message = baseException.getMessage();
                try {
                    return new ResponseEntity(buildError(baseException, request), getHttpStatus(baseException.getCode()));
                } catch (NumberFormatException e) {
                    return new ResponseEntity(message,
                            HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
        }
      private HttpStatus getHttpStatus(int code) {

            try {
                HttpStatus status = HttpStatus.valueOf(code);
                return status;
            }catch (Exception ex){
                return HttpStatus.BAD_REQUEST;
            }
      }

      private ErrorDetails buildError(BaseException baseException, HttpServletRequest request){
            ErrorDetails errorDetails = new ErrorDetails();
            errorDetails.setMessage(baseException.getMessage());
            errorDetails.setTimeStamp(new Date());
            errorDetails.setStatus(baseException.getStatus());
            errorDetails.setPath(request.getServletPath());
            return errorDetails;
      }

}
