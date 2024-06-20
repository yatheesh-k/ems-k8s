package com.pb.employee.config;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.auth.JwtTokenUtil;
import com.pb.employee.common.ResponseErrorObject;
import com.pb.employee.common.ResponseObject;
import com.pb.employee.request.ValidateLoginRequest;
import feign.FeignException;
import io.jsonwebtoken.*;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;

@Component
public class RestFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(RestFilter.class);
    private static Set<String> SWAGGER_URLS_TO_BYPASS_AUTH = Set.of(
                                                                "/ems/api-docs",
                                                                "/ems/swagger-ui/index.html",
            "/ems/api-docs/swagger-config");

    private Jws<Claims> parsedToken = null;
    @Autowired
    IRestIdentity iRestIdentity;
    @Autowired
    private Environment environment;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
                            throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        String token = req.getHeader("Authorization");
        String uri = req.getRequestURI();
        Set<String> excludeAPIList = new HashSet<>();
        excludeAPIList.add("/ems/health");
        excludeAPIList.add("/ems/health/livez");
        excludeAPIList.add("/ems/health/readyz");

        if( excludeAPIList.contains(uri) || isInSwaggerUiWhiteList(uri)) {
            logger.debug("Token validation is not required for url {}",req.getRequestURI());
        }else{
            if ((StringUtils.isNoneBlank(token))) {
                if (!StringUtils.containsIgnoreCase(token, "Bearer ")) {
                    logger.debug("Bearer prefix is missing");
                    buildResponseObject(req, res, "Token is not valid.", "Unauthorized Access", HttpStatus.UNAUTHORIZED);
                    return;
                }

                token = StringUtils.removeStartIgnoreCase(token,"Bearer ");

                /*if (hasNoRoles()) {
                    logger.debug("No role assigned to the User.");
                    buildResponseObject(req, res, "No roles assigned to the User.", "Unauthorized Access", HttpStatus.UNAUTHORIZED);
                    return;
                }*/
                try {
                    ValidateLoginRequest validateLoginRequest = ValidateLoginRequest.builder().
                            token(token).build();
                    ResponseEntity<Object> result = iRestIdentity.validateToken(validateLoginRequest);
                    if(result != null && result.getBody() != null){
                        logger.info(result.getBody().toString());
                    }
                } catch (FeignException.FeignClientException feignClientException) {
                    if (HttpStatus.UNAUTHORIZED.value() == feignClientException.status()) {
                        logger.debug("Token is not valid");
                        buildResponseObject(req, res,"Token is not valid.", "Unauthorized Access", HttpStatus.UNAUTHORIZED);
                        return;
                    }
                }catch (Exception e){
                    logger.error("Exception ",e);
                    throw e;
                }
            }else {
                logger.debug("Token is not valid");
                buildResponseObject(req, res,"Token is not valid.", "Unauthorized Access", HttpStatus.UNAUTHORIZED);
                return;
            }
        }

        String requestId = UUID.randomUUID().toString();
        MDC.put("requestId",requestId);

        chain.doFilter(request, response);

        MDC.clear();
    }

    private void buildResponseObject(HttpServletRequest req, HttpServletResponse res, String errorMessage, String msg, HttpStatus status) throws IOException {
        res.setStatus(status.value());
        ResponseObject responseObject = new ResponseObject();
        ResponseErrorObject errorResponse = new ResponseErrorObject();
        errorResponse.setMessage(errorMessage);
        responseObject.setError(errorResponse);
        responseObject.setMessage(msg);
        responseObject.setPath(req.getRequestURI());
        String strErrorResponse = new ObjectMapper().writeValueAsString(responseObject);
        res.getOutputStream().write(strErrorResponse.getBytes());
    }

    private boolean hasNoRoles() {
        return parsedToken.getBody().get("roles") == null;
    }


    /**
     * @param uri
     * @return
     */
    private boolean isInSwaggerUiWhiteList(String uri) {
        if(StringUtils.isNotBlank(uri)) {
            String prefix_swagger_ui_resources = "/ems/swagger-ui/";
            return SWAGGER_URLS_TO_BYPASS_AUTH.contains(uri) || uri.startsWith(prefix_swagger_ui_resources);
        }
        return false;
    }
}
