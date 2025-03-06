package com.pb.employee.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceRequest {

    private List<Map<
            @Pattern(regexp = "^[\\w\\s()\\-]+$", message = "{invoice.key.format}")
            @Size(min = 2, max = 1000, message = "{invoice.key.size}") String,

            @Pattern(regexp = "^[\\w\\s()\\-]+$", message = "{invoice.format}")
            @Size(min = 1, max = 1000, message = "{invoice.size}") String>> productData;

    private @NotNull(message = "{invoice.productColumns.null}")
    @NotEmpty(message = "{invoice.productColumns.empty}")
    List<@Valid ProductColoumnsRequest> productColumns;

    private String vendorCode;
    private String purchaseOrder;
    private String invoiceDate;
    private String dueDate;
    private String subTotal;
    private String status;
    private String bankId;
}

