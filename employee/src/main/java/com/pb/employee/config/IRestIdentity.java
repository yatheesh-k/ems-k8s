package com.pb.employee.config;

import com.pb.employee.request.ValidateLoginRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(url = "${identity.service.baseUrl}", name = "identity")
public interface IRestIdentity {

    @PostMapping(value = "/token/validate", produces = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<Object> validateToken(@RequestBody ValidateLoginRequest payload);


}
