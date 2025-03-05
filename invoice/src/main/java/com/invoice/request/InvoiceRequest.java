package com.invoice.request;

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
            @NotNull(message = "{invoice.key.notnull}") String,
            @NotNull(message = "{invoice.value.notnull}") String>> productData;

    private @NotNull(message = "{invoice.productColumns.null}")
    @NotEmpty(message = "{invoice.productColumns.empty}")
    List<@Valid ProductColumnsRequest> productColumns;

    private String vendorCode;
    private String purchaseOrder;

    private @PastOrPresent(message = "{invoice.date.pastOrPresent}")
    LocalDate invoiceDate;

    private String dueDate;
    private String subTotal;

    private String status;
    private String bankId;
}
