package com.pb.employee.request;

import lombok.*;

@Getter
@AllArgsConstructor

public enum EmployeeStatus {

    ACTIVE("Active"),
    INACTIVE("InActive"),
    PENDING("Pending");

    private final String status;
}
