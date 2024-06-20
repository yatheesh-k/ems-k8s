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
public class OTPRequest extends LoginRequest{

    @NotEmpty(message = "{user.password.missing.members}")
    @Schema(required = true,  description = "${login.password.description}", example = "password")
    private String otp;

    public OTPRequest(@NotEmpty(message = "{user.username.missing.members}") String username, @NotEmpty(message = "{user.password.missing.members}") String password) {
        super(username, password);
    }
}
