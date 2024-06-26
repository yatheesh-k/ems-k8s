package com.pb.employee.request;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentRequest {

    @NotBlank(message = "{companyname.missing.message}")
    private String companyName;
    private int id;
    private String name;
}