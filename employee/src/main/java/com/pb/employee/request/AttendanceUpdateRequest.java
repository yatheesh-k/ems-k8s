package com.pb.employee.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceUpdateRequest {

    private String month;
    private String year;

    @NotEmpty(message = "{total.working.days}")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("totalWorkingDays")
    private String totalWorkingDays;

    @NotEmpty(message = "{no.of.working.days}")
    @Schema(requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("noOfWorkingDays")
    private String noOfWorkingDays;
}
