package com.pb.employee.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceLetterFieldsRequest {

    private String companyName;
    private String employeeId;
    private String Date;

}
