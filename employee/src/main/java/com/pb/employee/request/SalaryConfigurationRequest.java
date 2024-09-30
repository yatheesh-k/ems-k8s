package com.pb.employee.request;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SalaryConfigurationRequest {

    private String companyName;
    private Map<String, String> allowances;
    private Map<String, String> deductions;
    private String status;
}
