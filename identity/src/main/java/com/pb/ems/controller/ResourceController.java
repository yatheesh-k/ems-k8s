package com.pb.ems.controller;

import com.pb.ems.common.ResponseBuilder;
import com.pb.ems.common.ResponseObject;
import com.pb.ems.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@CrossOrigin
@Component
@RequestMapping("/a")
@RestController
@io.swagger.v3.oas.annotations.tags.Tag(name = SwaggerConfig.EMPLOYEE_TAG)
@io.swagger.v3.oas.annotations.responses.ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "400", description= "The request is malformed or invalid."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "401", description= "The authorization token is invalid."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "403", description= "The user does not have the necessary privileges to perform the operation."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "404", description= "The specified resource was not found."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "500", description = "An internal server error occurred."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "503", description = "A service is unreachable."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(content = @io.swagger.v3.oas.annotations.media.Content(schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ResponseObject.class)),responseCode = "200", description = "The request is processed.")
})
public class ResourceController {

  private static final Logger logger = LoggerFactory.getLogger(ResourceController.class);

  @PostMapping(value = "/storage", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
  @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description= "Storage resource assigned to subscriber.")
  public  HttpEntity<ResponseObject<Object>> addResource(
          @Parameter(hidden=true, description = "${apiAuthToken.description}", required = true, example = "Bearer abcdef12-1234-1234-1234-abcdefabcdef")
          @RequestBody @Valid String payload)
           {
   logger.debug("inside");
    return new ResponseEntity<>(ResponseBuilder.builder().build().createSuccessResponse("resourceInformation"), HttpStatus.CREATED);
  }

}
