package com.pb.employee.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TemplateRequest {

    private String companyId;

    private String payslipTemplateNo;
    private String experienceTemplateNo;
    private String relievingTemplateNo;
    private String joiningTemplateNo;
    private String offerLetterTemplateNo;
    private String serviceLetterTemplateNo;
}
