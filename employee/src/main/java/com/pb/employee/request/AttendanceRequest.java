package com.pb.employee.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest{

    @NotNull(message = "${companyname.message}")
    @Pattern(regexp = "^[a-z]+$", message = "${employee.shortname.message}")
    private String company;

    private String employeeId;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[A-Z][a-z]*$", message = "{invalid.month}")
    private String month;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^\\d+$", message = "{invalid.year}")
    private String year;

    @NotNull(message = "{notnull.message}")
    @Pattern(regexp = "^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\\.[a-z]{2,}$", message = "{invalid.emailId}")
    private String emailId;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{name.message}")
    private String firstName;

    @Pattern(regexp = "^[A-Za-z]+$", message = "{name.message}")
    private String lastName;

    @NotNull(message = "{notnull.message}")
    @DecimalMax(value = "31", message = "{total.working.days}")
    @Digits(integer = 9, fraction = 0, message = "{total.working.days}")
    private String totalWorkingDays;

    @NotNull(message = "{notnull.message}")
    @DecimalMax(value = "31", message = "{no.of.working.days}")
    @Digits(integer = 9, fraction = 0, message = "{no.of.working.days}")
    private String noOfWorkingDays;

    private String type;



}