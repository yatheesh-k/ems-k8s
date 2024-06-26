package com.pb.employee.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentUpdateRequest {

    private String name;
}