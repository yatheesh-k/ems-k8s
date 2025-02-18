package com.invoice.request;

import jakarta.validation.constraints.Pattern;
import lombok.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequest {

    private Map<
            @Pattern(regexp = "^[a-zA-Z0-9&\\-\\s]+$", message = "{invoice.key.format}")
            @Size(min = 2, max = 50, message = "{invoice.key.size}") String,

            @Pattern(regexp = "^[a-zA-Z0-9&\\-\\s%]+$", message = "{invoice.format}")
            @Size(min = 1, max = 30, message = "{invoice.size}") String> invoice;

    private String status;
}
