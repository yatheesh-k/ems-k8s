package com.pathbreaker.payslip.response;

import lombok.Data;

@Data
public class ResultLoginResponse {

    private String result;

    private String role;

    private String id;

    private String name;

    private String imageFile;

}
