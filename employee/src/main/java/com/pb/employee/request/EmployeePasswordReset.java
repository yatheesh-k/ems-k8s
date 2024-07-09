package com.pb.employee.request;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeePasswordReset {



    private String companyName;
    private String password;
    private String newPassword;
}
