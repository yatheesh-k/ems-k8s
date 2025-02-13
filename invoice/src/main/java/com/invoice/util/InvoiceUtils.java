package com.invoice.util;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.invoice.model.*;
import com.invoice.opensearch.OpenSearchOperations;
import com.invoice.request.BankRequest;
import com.invoice.request.CustomerRequest;
import com.invoice.request.InvoiceRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;

@Slf4j
public class InvoiceUtils {

    @Autowired
    private OpenSearchOperations openSearchOperations;



    public static Entity maskInvoiceProperties(InvoiceRequest request, String invoiceId, CompanyEntity companyEntity,CustomerModel customerModel,BankEntity bankEntity) {
        ObjectMapper objectMapper = new ObjectMapper();

        // Convert the InvoiceRequest to InvoiceModel
        InvoiceModel entity = objectMapper.convertValue(request, InvoiceModel.class);

        // Set the resource ID and type
        entity.setInvoiceId(invoiceId);
        entity.setType(Constants.INVOICE);
        entity.setStatus(request.getStatus());
        entity.setCompanyId(companyEntity.getId());
        entity.setCustomerId(customerModel.getCustomerId());
        entity.setBank(bankEntity);
        entity.setCustomer(customerModel);
        entity.setCompany(companyEntity);
        // Mask invoice fields
        if (request.getInvoice() != null) {
            Map<String, String> maskedInvoice = new HashMap<>();
            for (Map.Entry<String, String> entry : request.getInvoice().entrySet()) {
                maskedInvoice.put(entry.getKey(), maskValue(entry.getValue())); // Mask the value
            }
            entity.setInvoice(maskedInvoice);
        }
        if (request.getProducts() != null) {
            List<Map<String, String>> maskedProducts = new ArrayList<>();

            for (Map<String, String> productMap : request.getProducts()) {
                Map<String, String> maskedMap = new HashMap<>();

                for (Map.Entry<String, String> entry : productMap.entrySet()) {
                    maskedMap.put(entry.getKey(), maskValue(entry.getValue())); // Apply masking function
                }

                maskedProducts.add(maskedMap);
            }
            entity.setProducts(maskedProducts);
        }

        return entity;
    }

    private static String maskValue(String value) {
        if (value == null || value.isEmpty()) {
            return value; // Return as is if null or empty
        }
        return Base64.getEncoder().encodeToString(value.toString().getBytes()); // Replace with your desired masking pattern
    }

    public static void unMaskInvoiceProperties(InvoiceModel invoiceEntity) {
        if (invoiceEntity != null) {
            log.debug("Unmasking invoice: {}", invoiceEntity);

            if (invoiceEntity.getInvoiceId() != null) {
                invoiceEntity.setInvoiceId(invoiceEntity.getInvoiceId());
            }
            if (invoiceEntity.getInvoice() != null) {
                Map<String, String> decodedCustomFields = new HashMap<>();
                for (Map.Entry<String, String> entry : invoiceEntity.getInvoice().entrySet()) {
                    decodedCustomFields.put(entry.getKey(), unMaskValue(entry.getValue()));
                }
                invoiceEntity.setInvoice(decodedCustomFields);
            }
            if (invoiceEntity.getProducts() != null) {
                List<Map<String, String>> maskedProducts = new ArrayList<>();

                for (Map<String, String> productMap : invoiceEntity.getProducts()) {
                    Map<String, String> maskedMap = new HashMap<>();

                    for (Map.Entry<String, String> entry : productMap.entrySet()) {
                        maskedMap.put(entry.getKey(), unMaskValue(entry.getValue())); // Apply masking function
                    }

                    maskedProducts.add(maskedMap);
                }

                invoiceEntity.setProducts(maskedProducts);
            }


            if (invoiceEntity.getCustomer() != null) {
                log.debug("Before unmasking customer: {}", invoiceEntity.getCustomer());
                invoiceEntity.getCustomer().setAddress(unMaskValue(invoiceEntity.getCustomer().getAddress()));
                invoiceEntity.getCustomer().setCity(unMaskValue(invoiceEntity.getCustomer().getCity()));
                invoiceEntity.getCustomer().setState(unMaskValue(invoiceEntity.getCustomer().getState()));
                invoiceEntity.getCustomer().setPinCode(unMaskValue(invoiceEntity.getCustomer().getPinCode()));
                invoiceEntity.getCustomer().setMobileNumber(unMaskValue(invoiceEntity.getCustomer().getMobileNumber()));
                invoiceEntity.getCustomer().setEmail(unMaskValue(invoiceEntity.getCustomer().getEmail()));
                invoiceEntity.getCustomer().setCustomerGstNo(unMaskValue(invoiceEntity.getCustomer().getCustomerGstNo()));
                log.debug("After unmasking customer: {}", invoiceEntity.getCustomer());
            }

            if (invoiceEntity.getBank() != null) {
                log.debug("Before unmasking bank: {}", invoiceEntity.getBank());
                invoiceEntity.getBank().setAccountNumber(unMaskValue(invoiceEntity.getBank().getAccountNumber()));
                invoiceEntity.getBank().setAccountType(unMaskValue(invoiceEntity.getBank().getAccountType()));
                invoiceEntity.getBank().setBankName(unMaskValue(invoiceEntity.getBank().getBankName()));
                invoiceEntity.getBank().setBranch(unMaskValue(invoiceEntity.getBank().getBranch()));
                invoiceEntity.getBank().setIfscCode(unMaskValue(invoiceEntity.getBank().getIfscCode()));
                invoiceEntity.getBank().setAddress(unMaskValue(invoiceEntity.getBank().getAddress()));
                log.debug("After unmasking bank: {}", invoiceEntity.getBank());
            }

            if (invoiceEntity.getCompany() != null) {
                log.debug("Before unmasking company: {}", invoiceEntity.getCompany());
                invoiceEntity.getCompany().setGstNo(unMaskValue(invoiceEntity.getCompany().getGstNo()));
                invoiceEntity.getCompany().setPanNo(unMaskValue(invoiceEntity.getCompany().getPanNo()));
                invoiceEntity.getCompany().setMobileNo(unMaskValue(invoiceEntity.getCompany().getMobileNo()));
                invoiceEntity.getCompany().setCinNo(unMaskValue(invoiceEntity.getCompany().getCinNo()));
                log.debug("After unmasking company: {}", invoiceEntity.getCompany());
            }
        }
    }



    private static String unMaskValue(String value) {
        if (value == null || value.isEmpty()) {
            return value; // Return as is if null or empty
        }
        return new String(Base64.getDecoder().decode(value)); // Correctly decode without extra bytes conversion
    }
}