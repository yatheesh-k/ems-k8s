package com.invoice.serviceImpl;

import com.invoice.common.ResponseBuilder;
import com.invoice.config.Config;
import com.invoice.config.NumberToWordsConverter;
import com.invoice.exception.InvoiceErrorMessageHandler;
import com.invoice.exception.InvoiceErrorMessageKey;
import com.invoice.exception.InvoiceException;
import com.invoice.model.*;
import com.invoice.opensearch.OpenSearchOperations;
import com.invoice.repository.CustomerRepository;
import com.invoice.request.InvoiceRequest;
import com.invoice.response.InvoiceResponse;
import com.invoice.service.InvoiceService;
import com.invoice.util.Constants;
import com.invoice.util.CustomerUtils;
import com.invoice.util.InvoiceUtils;
import com.invoice.util.ResourceIdUtils;
import com.itextpdf.text.DocumentException;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.util.*;


@Service
@Slf4j
public class InvoiceServiceImpl implements InvoiceService {

    @Autowired
    private OpenSearchOperations openSearchOperations;

    @Autowired
    private Configuration freeMarkerConfig;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private Config config;

    @Override
    public ResponseEntity<?> generateInvoice(String companyId,String customerId,InvoiceRequest request) throws InvoiceException, IOException {
        CompanyEntity companyEntity;
        BankEntity bankEntity;

        companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
        if (companyEntity == null) {
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.COMPANY_NOT_FOUND), HttpStatus.NOT_FOUND);
        }
        String index = ResourceIdUtils.generateCompanyIndex(companyEntity.getShortName());

        CustomerModel customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new InvoiceException(
                        InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.CUSTOMER_NOT_FOUND), HttpStatus.BAD_REQUEST));
        // Check if the customer belongs to the provided companyId
        if (!customer.getCompanyId().equals(companyId)) {
            log.error("Customer ID {} does not belong to company ID {}", customer.getCustomerId(), companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.CUSTOMER_NOT_ASSOCIATED_WITH_COMPANY), HttpStatus.BAD_REQUEST);
        }
        bankEntity=openSearchOperations.getBankById(index,null,request.getBankId());
        if (bankEntity== null){
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.BANK_DETAILS_NOT_FOUND), HttpStatus.NOT_FOUND);
        }

        try
        {
            InvoiceModel invoiceModel;
            // Step 4.1: Generate a unique resource ID for the customer using companyId and customer details
            String invoiceId = ResourceIdUtils.generateInvoiceResourceId(companyId,bankEntity.getAccountNumber());
            invoiceModel = openSearchOperations.getInvoiceById(index, null, invoiceId);
            if (invoiceModel!=null) {
                throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVOICE_ALREADY_EXISTS), HttpStatus.NOT_FOUND);
            }
            Entity invoiceEntity = InvoiceUtils.maskInvoiceProperties(request, invoiceId,companyEntity,customer,bankEntity);
            openSearchOperations.saveEntity(invoiceEntity,invoiceId,index);

            log.info("Invoice created successfully for customer: {}", customerId);
            return new ResponseEntity<>(ResponseBuilder.builder().build().createSuccessResponse(Constants.CREATE_SUCCESS), HttpStatus.CREATED);
        } catch (InvoiceException e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            throw new InvoiceException(InvoiceErrorMessageKey.UNEXPECTED_ERROR.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getCompanyAllInvoices(String companyId, String customerId) throws InvoiceException, IOException {
        List<InvoiceModel> invoiceEntities;

        try {
            // Fetch company by ID
            CompanyEntity companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
            if (companyEntity == null) {
                throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.COMPANY_NOT_FOUND), HttpStatus.NOT_FOUND);
            }

            // Generate index specific to the company's short name
            String index = ResourceIdUtils.generateCompanyIndex(companyEntity.getShortName());

            // Fetch invoices based on the presence of customerId
             invoiceEntities = StringUtils.hasText(customerId)
                    ? openSearchOperations.getInvoicesByCustomerId(companyId, customerId, index)
                    : openSearchOperations.getInvoicesByCompanyId(companyId, index);

            // If no invoices are found
            if (invoiceEntities == null || invoiceEntities.isEmpty()) {
                throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVOICE_NOT_FOUND), HttpStatus.NOT_FOUND);
            }

            // Unmask sensitive properties in each invoice
            invoiceEntities.forEach(InvoiceUtils::unMaskInvoiceProperties);

            // Return success response with the list of invoices
            return ResponseEntity.ok(ResponseBuilder.builder().build().createSuccessResponse(invoiceEntities));

        } catch (Exception ex) {
            log.error("Exception while fetching invoices for company {} and customer {}: {}", companyId, customerId, ex.getMessage());
            throw new InvoiceException("Unable to fetch invoices.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



   /* @Override
    public ResponseEntity<?> getInvoiceById(String companyId, String customerId, String invoiceId) throws InvoiceException, IOException {
        log.info("Fetching Invoice with ID: {}", invoiceId);

        // Fetch Company Entity
        CompanyEntity companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
        if (companyEntity == null) {
            log.error("Company with ID {} not found", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.COMPANY_NOT_FOUND), HttpStatus.NOT_FOUND);
        }

        // Fetch Invoice Model (Only Once)
        InvoiceModel invoiceModel = repository.findByInvoiceId(invoiceId);
        if (invoiceModel == null) {
            log.error("No invoices found for Company ID {}", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVOICE_NOT_FOUND), HttpStatus.NOT_FOUND);
        }

        // Fetch Bank Details
        String bankId = invoiceModel.getBankId();
        String companyIndex = ResourceIdUtils.generateCompanyIndex(companyEntity.getShortName());
        BankEntity bankEntity;
        try {
            bankEntity = openSearchOperations.getBankById(companyIndex, null, bankId);
            if (bankEntity == null) {
                log.error("No bank details found for company index: {}", companyIndex);
                throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.BANK_DETAILS_NOT_FOUND), HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            log.error("Error while fetching bank details for company ID {}: {}", companyId, ex.getMessage());
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.UNABLE_GET_BANK_DETAILS), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Fetch Customer Model
        CustomerModel customerModel = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.error("Customer with ID {} not found", customerId);
                    return new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.CUSTOMER_NOT_FOUND), HttpStatus.NOT_FOUND);
                });

        // Build and Return Invoice Response
        try {
            InvoiceResponse invoiceDetails = InvoiceUtils.fromEntities(companyEntity, customerModel, invoiceModel, Collections.singletonList(bankEntity));

            InvoiceResponse invoiceResponse = decodeInvoiceResponse(invoiceDetails);

            return ResponseEntity.ok(invoiceResponse);
        } catch (Exception ex) {
            log.error("Error while building invoice response for ID {}: {}", invoiceId, ex.getMessage());
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.RESPONSE_BUILD_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getCustomerAllInvoices(String companyId, String customerId) throws InvoiceException, IOException {
        log.info("Fetching Invoice with Customer ID: {}", customerId);
        // Fetch Company Entity
        CompanyEntity companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
        if (companyEntity == null) {
            log.error("Company with ID {} not found", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.COMPANY_NOT_FOUND), HttpStatus.NOT_FOUND);
        }
        // Fetch Bank Details
        String companyIndex = ResourceIdUtils.generateCompanyIndex(companyEntity.getShortName());
        // Fetch All Invoices for Customer
        List<InvoiceModel> invoiceModels = repository.findAllByCustomerId(customerId);
        if (invoiceModels.isEmpty()) {
            log.error("No invoices found for Customer ID: {}", customerId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVOICE_NOT_FOUND), HttpStatus.NOT_FOUND);
        }
        // Fetch Customer Model
        CustomerModel customerModel = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.error("Customer with ID {} not found", customerId);
                    return new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.CUSTOMER_NOT_FOUND), HttpStatus.NOT_FOUND);
                });
        try {
            List<InvoiceResponse> invoiceResponses = invoiceModels.stream().map(invoiceModel -> {
                // Fetch Bank Details for the Invoice
                BankEntity bankEntity = null;
                String bankId = invoiceModel.getBankId();
                if (bankId != null) {
                    try {
                        bankEntity = openSearchOperations.getBankById(companyIndex, null, bankId);
                        if (bankEntity == null) {
                            log.warn("No bank details found for bankId: {}", bankId);
                        }
                    } catch (Exception ex) {
                        log.error("Error while fetching bank details for bankId {}: {}", bankId, ex.getMessage());
                    }
                }
                // Build InvoiceResponse
                return InvoiceUtils.fromEntities(companyEntity, customerModel, invoiceModel, bankEntity != null ? Collections.singletonList(bankEntity) : Collections.emptyList());
            }).map(InvoiceUtils::decodeInvoiceResponse).toList();

            return ResponseEntity.ok(invoiceResponses);
        } catch (Exception ex) {
            log.error("Error while building invoice responses for Customer ID {}: {}", customerId, ex.getMessage());
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.RESPONSE_BUILD_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> getCompanyAllInvoices(String companyId) throws InvoiceException, IOException {
        log.info("Fetching all invoices for Company ID: {}", companyId);
        // Fetch Company Entity
        CompanyEntity companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
        if (companyEntity == null) {
            log.error("Company with ID {} not found", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.COMPANY_NOT_FOUND), HttpStatus.NOT_FOUND);
        }
        // Fetch Bank Details
        String companyIndex = ResourceIdUtils.generateCompanyIndex(companyEntity.getShortName());
        // Fetch All Invoices for the Company
        List<InvoiceModel> invoiceModels = repository.findAllByCompanyId(companyId);
        if (invoiceModels.isEmpty()) {
            log.error("No invoices found for Company ID: {}", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVOICE_NOT_FOUND), HttpStatus.NOT_FOUND);
        }
        try {
            List<InvoiceResponse> invoiceResponses = invoiceModels.stream().map(invoiceModel -> {
                // Fetch Customer Model for the Invoice
                CustomerModel customerModel = customerRepository.findById(invoiceModel.getCustomerId())
                        .orElse(null);

                // Fetch Bank Details for the Invoice
                BankEntity bankEntity = null;
                String bankId = invoiceModel.getBankId();
                if (bankId != null) {
                    try {
                        bankEntity = openSearchOperations.getBankById(companyIndex, null, bankId);
                        if (bankEntity == null) {
                            log.warn("No bank details found for bankId: {}", bankId);
                        }
                    } catch (Exception ex) {
                        log.error("Error while fetching bank details for bankId {}: {}", bankId, ex.getMessage());
                    }
                }

                // Build InvoiceResponse
                return InvoiceUtils.fromEntities(companyEntity, customerModel, invoiceModel, bankEntity != null ? Collections.singletonList(bankEntity) : Collections.emptyList());
            }).map(InvoiceUtils::decodeInvoiceResponse).toList();

            return ResponseEntity.ok(invoiceResponses);
        } catch (Exception ex) {
            log.error("Error while building invoice responses for Company ID {}: {}", companyId, ex.getMessage());
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.RESPONSE_BUILD_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<?> downloadInvoice(String companyId, String customerId, String invoiceId, HttpServletRequest request) throws InvoiceException, IOException {
        log.info("Download Invoice with ID: {}", invoiceId);

        // Fetch Company Entity
        CompanyEntity companyEntity = openSearchOperations.getCompanyById(companyId, null, Constants.INDEX_EMS);
        if (companyEntity == null) {
            log.error("Company with ID {} not found", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.COMPANY_NOT_FOUND), HttpStatus.NOT_FOUND);
        }

        // Fetch Invoice Model (Only Once)
        InvoiceModel invoiceModel = repository.findByInvoiceId(invoiceId);
        if (invoiceModel == null) {
            log.error("No invoices found for Company ID {}", companyId);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVOICE_NOT_FOUND), HttpStatus.NOT_FOUND);
        }

        // Fetch Bank Details
        String bankId = invoiceModel.getBankId();
        String companyIndex = ResourceIdUtils.generateCompanyIndex(companyEntity.getShortName());
        BankEntity bankEntity;

        try {
            bankEntity = openSearchOperations.getBankById(companyIndex, null, bankId);
            if (bankEntity == null) {
                log.error("No bank details found for company index: {}", companyIndex);
                throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.BANK_DETAILS_NOT_FOUND), HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            log.error("Error while fetching bank details for company ID {}: {}", companyId, ex.getMessage());
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.UNABLE_GET_BANK_DETAILS), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Fetch Customer Model
        CustomerModel customerModel = customerRepository.findById(customerId)
                .orElseThrow(() -> {
                    log.error("Customer with ID {} not found", customerId);
                    return new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.CUSTOMER_NOT_FOUND), HttpStatus.NOT_FOUND);
                });

        try {
            // Create InvoiceResponse
            InvoiceResponse invoiceDetails = InvoiceUtils.fromEntities(companyEntity, customerModel, invoiceModel, Collections.singletonList(bankEntity));
            InvoiceResponse invoiceResponse = decodeInvoiceResponse(invoiceDetails);

            // Generate HTML from FreeMarker template
            Template template = freeMarkerConfig.getTemplate(Constants.TEMPLATE);
            StringWriter stringWriter = new StringWriter();
            try {
                template.process(invoiceResponse, stringWriter);
            } catch (TemplateException e) {
                log.error("Error processing FreeMarker template: {}", e.getMessage());
                throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVALID_COMPANY), HttpStatus.NOT_FOUND);
            }
            String htmlContent = stringWriter.toString();

            // Generate PDF
            byte[] pdfContent = generatePdfFromHtml(htmlContent);

            // Return PDF as response
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder(Constants.ATTACHMENT)
                    .filename(Constants.INVOICE_ + invoiceId + Constants.PDF)
                    .build());

            log.info("Invoice with ID: {} generated successfully", invoiceId);
            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("An error occurred while fetching or generating invoice: {}", e.getMessage(), e);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.INVALID_INVOICE_ID_FORMAT), HttpStatus.BAD_REQUEST);
        }
    }

    private byte[] generatePdfFromHtml(String html) throws IOException {
        html = html.replaceAll("&(?![a-zA-Z]{2,6};|#\\d{1,5};)", "&amp;");
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(baos);
            return baos.toByteArray();
        } catch (DocumentException e) {
            throw new IOException(e.getMessage());
        }
    }
*/
}