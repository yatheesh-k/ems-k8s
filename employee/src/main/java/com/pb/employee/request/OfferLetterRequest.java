package com.pb.employee.request;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.pb.employee.persistance.model.Entity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class OfferLetterRequest {


    @Schema(example = "yyyy-mm-dd")
    @Pattern(regexp =  "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "{offerDate.format}")
    @NotBlank(message = "{offerDate.notnull.message}")
    private String offerDate;

    @Schema(example = "referenceNo")
    @Pattern(regexp ="^[A-Z]{4}/[A-Z]{5}/\\\\d{6}$", message = "{referenceNo.format}")
    @Size(min = 3, max = 20, message = "{referenceNo.size.message}")
    private String referenceNo;

    @Schema(example = "employeeName")
    @Pattern(regexp ="^(?!.*\\b([A-Z])\\s\\1\\s\\1)(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*|[A-Z](?:\\.? ?[A-Z])? ?[A-Z][a-z]+|[A-Z][a-z]+(?: [A-Z](?:\\.? ?[A-Z])?)+)$",
            message = "{firstname.format}")
    @Size(min = 3, max = 20, message = "{firstName.size.message}")
    private String employeeName;

    @Schema(example = "employeeName")
    @Pattern(regexp ="^(?!.*\\b([A-Z])\\s\\1\\s\\1)(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*|[A-Z](?:\\.? ?[A-Z])? ?[A-Z][a-z]+|[A-Z][a-z]+(?: [A-Z](?:\\.? ?[A-Z])?)+)$",
            message = "{firstname.format}")
    @Size(min = 3, max = 20, message = "{firstName.size.message}")
    private String employeeFatherName;

    @Schema(example = "address")
    @Pattern(regexp = "^(?!.*\\s{2,})(?!^([a-zA-Z]{1}\\s?){2,}$)(?!^[A-Z](?:\\s[A-Z])*$)(?!^[\\s]*$)[A-Za-z0-9]+(?:[\\s.,'#&*()^/][A-Za-z0-9]+)*(?:[\\s.,'#&*()/-]*[A-Za-z0-9]+)*(?:[\\s]*[.,#&*()/-]*\\s*)*$", message = "{location.format}")
    @Size(min = 2, max = 200, message = "{location.notnull.message}")
    private String employeeAddress;

    @Schema(example = "employeeFirstName")
    @Pattern(regexp ="^(?!.*\\b([A-Z])\\s\\1\\s\\1)(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*|[A-Z](?:\\.? ?[A-Z])? ?[A-Z][a-z]+|[A-Z][a-z]+(?: [A-Z](?:\\.? ?[A-Z])?)+)$",
            message = "{firstname.format}")
    @Size(min = 3, max = 20, message = "{firstName.size.message}")
    private String employeeFirstName;

    @Schema(example = "contactNo")
    @NotNull(message = "{mobileNo.notnull.message}")
    @Pattern(regexp ="^(?!([0-9])\\1{9})\\d{10}$", message = "{invalid.mobileNo}")
    private String employeeContactNo;

    @Schema(example = "yyyy-mm-dd")
    @Pattern(regexp =  "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$", message = "{joining.format}")
    @NotBlank(message = "{joining.notnull.message}")
    private String joiningDate;

    @Schema(example = "jobLocation")
    @Pattern(regexp = "^(?!.*\\s{2,})(?!^([a-zA-Z]{1}\\s?){2,}$)(?!^[A-Z](?:\\s[A-Z])*$)(?!^[\\s]*$)[A-Za-z0-9]+(?:[\\s.,'#&*()^/][A-Za-z0-9]+)*(?:[\\s.,'#&*()/-]*[A-Za-z0-9]+)*(?:[\\s]*[.,#&*()/-]*\\s*)*$", message = "{location.format}")
    @Size(min = 2, max = 200, message = "{location.notnull.message}")
    private String jobLocation;

    @Schema(example = "grossAmount")
    @Pattern(regexp = "^\\d+(\\.\\d{1,2})?$", message = "{grossAmount.format}")
    @Size(min = 4, max = 20, message = "{grossAmount.size.message}")
    private Double grossCompensation;

    private String companyId;
    private String salaryConfigurationId;

    @Schema(example = "employeePosition")
    @Pattern(regexp = "^(?!.*\\b([A-Z])\\s\\1\\s\\1)(?:[A-Z][a-z]+(?: [A-Z][a-z]+)*|[A-Z](?:\\.? ?[A-Z])? ?[A-Z][a-z]+)$", message = "{invalid.format}")
    private String employeePosition;

}