package com.pb.ems.opensearch;

import com.pb.ems.exception.IdentityException;
import com.pb.ems.model.UserEntity;
import com.pb.ems.persistance.Entity;
import com.pb.ems.util.Constants;
import org.opensearch.client.opensearch.OpenSearchClient;
import org.opensearch.client.opensearch._types.Result;
import org.opensearch.client.opensearch._types.query_dsl.BoolQuery;
import org.opensearch.client.opensearch.core.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OpenSearchOperations {

    private static final Integer SIZE_ELASTIC_SEARCH_MAX_VAL = 9999;
    Logger logger = LoggerFactory.getLogger(OpenSearchOperations.class);

    @Autowired
    private OpenSearchClient esClient;


    public Entity saveEntity(Entity entity, String Id, String index) throws IdentityException {
        IndexResponse indexResponse = null;
        try {
            synchronized (entity){
                indexResponse = esClient.index(builder -> builder.index(index)
                                        .id(Id)
                                        .document(entity));
            }
            logger.debug("Saved the entity. Response {}.Entity:{}",indexResponse, entity);
        } catch (IOException e) {
            logger.error("Exception ",e);
            throw new IdentityException(String.format("Unable to save the entity {} ",entity.toString()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return entity;
    }

    public String deleteEntity(String Id, String index) throws IdentityException {
        logger.debug("Deleting the Entity {}", Id);
        DeleteResponse deleteResponse = null;
        try {
            synchronized (Id){
                deleteResponse = esClient.delete(b -> b.index(index)
                                      .id(Id));

            }
            if(deleteResponse.result() == Result.NotFound) {
                throw new IdentityException(String.format("Entity Id not found",Id), HttpStatus.NOT_FOUND);
            }
            logger.debug("Deleted the Entity {}, Delete response {}", Id, deleteResponse);
        } catch (IOException e) {
            e.printStackTrace();
            throw new IdentityException(String.format("Exception while deleting Entity {} .",Id), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return Id;
    }

    public UserEntity getEMSAdminById(String user) throws IOException {
        GetRequest getRequest = new GetRequest.Builder().id(Constants.EMS_ADMIN+"_"+user)
                .index(Constants.INDEX_EMS).build();
        GetResponse<UserEntity> searchResponse = esClient.get(getRequest, UserEntity.class);
        if(searchResponse != null && searchResponse.source() != null){
            return searchResponse.source();
        }
        return null;
    }
    public UserEntity getEmployeeById(String user, String company) throws IOException {
        String index = Constants.INDEX_EMS+"_"+company;
        GetRequest getRequest = new GetRequest.Builder().id(Constants.EMPLOYEE+"_"+user)
                .index(index).build();
        GetResponse<UserEntity> searchResponse = esClient.get(getRequest, UserEntity.class);
        if(searchResponse != null && searchResponse.source() != null){
            return searchResponse.source();
        }
        return null;
    }

    public SearchResponse<Object> searchByQuery(BoolQuery.Builder query, String index, Class targetClass) throws IdentityException {
        SearchResponse searchResponse = null;
        try {
            searchResponse = esClient.search(t -> t.index(index).size(SIZE_ELASTIC_SEARCH_MAX_VAL)
                    .query(query.build()._toQuery()), targetClass.getClass());
        } catch (IOException e) {
            e.printStackTrace();
            throw new IdentityException("Search operation Failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return searchResponse;
    }
}
