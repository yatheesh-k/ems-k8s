package com.pb.employee.config;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = AgeValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidAge {
    String message() default "Employee must be at least 21 years old at the time of hiring.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
