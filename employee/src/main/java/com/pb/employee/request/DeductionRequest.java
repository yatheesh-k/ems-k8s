package com.pb.employee.request;


import com.pb.employee.persistance.model.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeductionRequest {


    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{pfEmployee.format}")
    private String pfEmployee;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{pfEmployer.format}")
    private String pfEmployer;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{lop.format}")
    private String lop;

    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{totalDeductions.format}")
    private String totalDeductions;
//    private String pfTax;
//    private String totalTax;



}