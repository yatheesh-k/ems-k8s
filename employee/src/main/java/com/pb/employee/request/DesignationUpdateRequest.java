package com.pb.employee.request;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DesignationUpdateRequest {

    @NotBlank(message = "{companyname.message}")
    private String companyName;
    private String name;
}
