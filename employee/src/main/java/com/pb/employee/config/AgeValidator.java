package com.pb.employee.config;

import com.pb.employee.request.EmployeeRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.Period;

public class AgeValidator implements ConstraintValidator<ValidAge, EmployeeRequest> {

    @Override
    public boolean isValid(EmployeeRequest employeeRequest, ConstraintValidatorContext context) {
        if (employeeRequest.getDateOfBirth() == null || employeeRequest.getDateOfHiring() == null) {
            return true; // This validation is not about null checks, so we skip validation if dates are not present
        }

        LocalDate dateOfBirth = LocalDate.parse(employeeRequest.getDateOfBirth());
        LocalDate dateOfHiring = LocalDate.parse(employeeRequest.getDateOfHiring());

        return Period.between(dateOfBirth, dateOfHiring).getYears() >= 21;
    }
}

