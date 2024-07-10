package com.pb.employee.request;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest{

    private String company;
    private String employeeId;
    private String month;
    private String year;

    @NotEmpty(message = "The totalWorking days is required")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("totalWorkingDays")
    private String totalWorkingDays;

    @NotEmpty(message = "The no of working days is required")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("noOfWorkingDays")
    private String noOfWorkingDays;

    private String type;



}