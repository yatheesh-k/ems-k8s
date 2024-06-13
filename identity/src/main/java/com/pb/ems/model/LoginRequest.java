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
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotEmpty(message = "{user.username.missing.members}")
    @Schema(required = true,  description = "${login.username.description}", example = "admin")
    @JsonProperty("username")
    private String username;

    @NotEmpty(message = "{user.password.missing.members}")
    @Schema(required = true,  description = "${login.password.description}", example = "hitachi1")
    @JsonProperty("password")
    private String password;
}
