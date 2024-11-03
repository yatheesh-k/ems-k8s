package com.pb.employee.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class InternshipRequest {

    private String companyId;

    private String date;
    private String employeeName;
    private String period;
    private String department;
    private String startDate;
    private String endDate;
    private String projectTitle;
    private String designation;

}
