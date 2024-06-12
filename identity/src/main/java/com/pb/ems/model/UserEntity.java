package com.pb.ems.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.pb.ems.persistance.Entity;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserEntity implements Entity {

    private String resourceId;
    private String type;
    private String username;
    private String password;
    private String companyId;
}
