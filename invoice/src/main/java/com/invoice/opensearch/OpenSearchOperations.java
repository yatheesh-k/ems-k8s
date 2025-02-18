package com.invoice.opensearch;

import com.invoice.exception.InvoiceErrorMessageHandler;
import com.invoice.exception.InvoiceErrorMessageKey;
import com.invoice.exception.InvoiceException;
import com.invoice.model.BankEntity;
import com.invoice.model.CompanyEntity;
import com.invoice.model.Entity;
import com.invoice.model.InvoiceModel;
import com.invoice.util.Constants;
import org.opensearch.client.opensearch._types.FieldValue;
import org.opensearch.client.opensearch._types.query_dsl.BoolQuery;
import org.opensearch.client.opensearch.core.search.Hit;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch.core.*;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class OpenSearchOperations {

    private static final Integer SIZE_ELASTIC_SEARCH_MAX_VAL = 9999;
    Logger logger = LoggerFactory.getLogger(OpenSearchOperations.class);


    @Autowired
    private OpenSearchClient esClient;

    public CompanyEntity getCompanyById(String resourceId, String type, String index) throws IOException {
        if (type != null) {
            resourceId = type + "_" + resourceId;
        }
        GetRequest getRequest = new GetRequest.Builder().id(resourceId)
                .index(index).build();
        GetResponse<CompanyEntity> searchResponse = esClient.get(getRequest, CompanyEntity.class);
        if (searchResponse != null && searchResponse.source() != null) {
            return searchResponse.source();
        }
        return null;
    }

    public List<BankEntity> getBankDetailsOfCompany(String index) throws  InvoiceException {
        logger.debug("Getting the Resource by id : {}", index);
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();
        boolQueryBuilder =
                boolQueryBuilder.filter(q -> q.term(t -> t.field(Constants.TYPE).value(FieldValue.of(Constants.BANK))));

        BoolQuery.Builder finalBoolQueryBuilder = boolQueryBuilder;
        SearchResponse<BankEntity> searchResponse = null;
        try {
            searchResponse = esClient.search(t -> t.index(index).size(SIZE_ELASTIC_SEARCH_MAX_VAL)
                    .query(finalBoolQueryBuilder.build()._toQuery()), BankEntity.class);
        } catch (IOException e) {
            e.getStackTrace();
            logger.error(e.getMessage());
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.UNABLE_TO_SEARCH), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        List<Hit<BankEntity>> hits = searchResponse.hits().hits();
        logger.info("Number of hits {}", hits.size());
        List<BankEntity> departmentEntities = new ArrayList<>();
        if (hits.size() > 0) {
            for (Hit<BankEntity> hit : hits) {
                departmentEntities.add(hit.source());
            }
        }
        return departmentEntities;
    }

    public BankEntity getBankById(String index, String type, String resourceId) throws IOException {
        if (type != null) {
            resourceId = type + "_" + resourceId;
        }
        GetRequest getRequest = new GetRequest.Builder().id(resourceId)
                .index(index).build();
        GetResponse<BankEntity> searchResponse = esClient.get(getRequest, BankEntity.class);
        if (searchResponse != null && searchResponse.source() != null) {
            return searchResponse.source();
        }
        return null;
    }

    public InvoiceModel getInvoiceById(String index, String type, String resourceId) throws IOException{
        if (type != null) {
            resourceId = type + "_" + resourceId;
        }
        GetRequest getRequest = new GetRequest.Builder().id(resourceId)
                .index(index).build();
        GetResponse<InvoiceModel> searchResponse = esClient.get(getRequest, InvoiceModel.class);
        if (searchResponse != null && searchResponse.source() != null) {
            return searchResponse.source();
        }
        return null;
    }

    public Entity saveEntity(Entity entity, String Id, String index) throws InvoiceException {
        IndexResponse indexResponse = null;
        try {
            synchronized (entity) {
                indexResponse = esClient.index(builder -> builder.index(index)
                        .id(Id)
                        .document(entity));
            }
            logger.debug("Saved the entity. Response {}.Entity:{}", indexResponse, entity);
        } catch (IOException e) {
            logger.error("Exception ", e);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.UNEXPECTED_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return entity;
    }

    public List<InvoiceModel> getInvoicesByCustomerId(String companyId, String customerId, String index) throws InvoiceException {
        logger.debug("Getting invoices for company {} and customer {} from index {}", companyId, customerId, index);

        // Build query
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
                .filter(q -> q.matchPhrase(t -> t.field(Constants.TYPE).query(Constants.INVOICE)))
                .filter(q -> q.matchPhrase(t -> t.field(Constants.COMPANY_ID).query(companyId)));

        if (StringUtils.hasText(customerId)) {
            boolQueryBuilder.filter(q -> q.matchPhrase(t -> t.field(Constants.CUSTOMER_ID).query(customerId)));
        }

        try {
            // Execute search
            SearchResponse<InvoiceModel> searchResponse = esClient.search(t ->
                            t.index(index)
                                    .size(SIZE_ELASTIC_SEARCH_MAX_VAL)
                                    .query(boolQueryBuilder.build().toQuery()),
                    InvoiceModel.class
            );

            List<Hit<InvoiceModel>> hits = Optional.ofNullable(searchResponse.hits()).map(h -> h.hits()).orElse(Collections.emptyList());
            logger.info("Number of invoice hits for company {} and customer {}: {}", companyId, customerId, hits.size());

            return hits.stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)  // Ensure no null values
                    .collect(Collectors.toList());

        } catch (IOException e) {
            logger.error("Error fetching invoices for company {} and customer {}: ", companyId, customerId, e);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.UNABLE_TO_SEARCH), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public List<InvoiceModel> getInvoicesByCompanyId(String companyId, String index) throws InvoiceException {
        logger.debug("Getting invoices for company {} from index {}", companyId, index);

        // Build query
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder()
                .filter(q -> q.matchPhrase(t -> t.field(Constants.TYPE).query(Constants.INVOICE)))
                .filter(q -> q.matchPhrase(t -> t.field(Constants.COMPANY_ID).query(companyId)));

        try {
            // Execute search
            SearchResponse<InvoiceModel> searchResponse = esClient.search(t ->
                            t.index(index)
                                    .size(SIZE_ELASTIC_SEARCH_MAX_VAL)
                                    .query(boolQueryBuilder.build().toQuery()),
                    InvoiceModel.class
            );

            List<Hit<InvoiceModel>> hits = Optional.ofNullable(searchResponse.hits()).map(h -> h.hits()).orElse(Collections.emptyList());
            logger.info("Number of invoice hits for company {}: {}", companyId, hits.size());

            return hits.stream()
                    .map(Hit::source)
                    .filter(Objects::nonNull)  // Ensure no null values
                    .collect(Collectors.toList());

        } catch (IOException e) {
            logger.error("Error fetching invoices for company {}: ", companyId, e);
            throw new InvoiceException(InvoiceErrorMessageHandler.getMessage(InvoiceErrorMessageKey.UNABLE_TO_SEARCH), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}