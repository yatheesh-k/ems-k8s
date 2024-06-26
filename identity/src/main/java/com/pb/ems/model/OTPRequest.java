package com.pb.ems.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OTPRequest{

    @NotEmpty(message = "{user.otp.message}")
    @Schema(required = true,  description = "${login.otp.description}", example = "123456")
    private Long otp;

    @NotEmpty(message = "{user.username.message}")
    @Schema(required = true,  description = "${login.username.description}", example = "path@gmail.com")
    private String username;

    @NotEmpty(message = "{user.company.message}")
    @Schema(required = true,  description = "${login.company.description}", example = "company")
    private String company;


}
