package com.invoice.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class InvoiceModel implements Entity{

    @Id
    private String invoiceId;
    private String companyId;
    private String customerId;

    private CompanyEntity company;
    private CustomerModel customer;
    private BankEntity bank;

    private Map<String, String> invoice;
    private List<Map<String, String>> products;

    private String status;
    private String type;
}