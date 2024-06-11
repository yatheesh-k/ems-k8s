package com.pathbreaker.services.filters.filter;

import com.pathbreaker.services.filters.exceptions.BaseException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@PropertySource(value={"classpath:application-common.yml"})
@Slf4j
public class CustomFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        log.info("[CustomFilter] - Inside the do filter method executed..");
        log.info("Local Port : "+request.getLocalPort());
        log.info("server Name : "+request.getServerName());
        log.info("Server Path : "+request.getServletPath());
        log.info("Request Uri is : "+request.getRequestURI());

        filterChain.doFilter(request,response);
    }
}
