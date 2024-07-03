package com.pb.employee.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pb.employee.persistance.model.Entity;
import com.pb.employee.persistance.model.SalaryEntity;
import jakarta.validation.constraints.NotBlank;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class PayslipRequest {



    @NotBlank(message = "{companyname.message}")
    private String companyName;

    private String month;
    private String year;

}
