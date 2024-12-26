package com.pb.employee.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankRequest {

    private String accountNumber;
    private String accountType;
    private String bankName;
    private String branch;
    private String ifscCode;
    private String address;
}