package com.pb.employee.request;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceLetterRequest {

    private String image;
    private String title;
    private String Date;
    private String heading;
    private List<String> content;
}
