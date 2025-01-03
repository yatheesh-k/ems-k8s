package com.invoice.opensearch;

import com.invoice.model.CompanyEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch.core.*;

import java.io.IOException;

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

}