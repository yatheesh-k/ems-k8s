package com.pb.employee.persistance.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class TemplateEntity implements Entity  {

    private String templateId;
    private String companyId;

    private String payslipTemplateNo;
    private String experienceTemplateNo;
    private String relievingTemplateNo;
    private String joiningTemplateNo;
    private String offerLetterTemplateNo;
    private String serviceLetterTemplateNo;
    private String type;
}
