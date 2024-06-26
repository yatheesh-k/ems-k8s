package com.pb.ems.opensearch;

import com.pb.ems.exception.IdentityException;
import com.pb.ems.model.EmployeeEntity;
import com.pb.ems.persistance.Entity;
import com.pb.ems.util.Constants;
import com.pb.ems.util.ResourceUtils;
import org.apache.commons.codec.digest.DigestUtils;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;

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

    public EmployeeEntity getEMSAdminById(String user) throws IOException {
        GetRequest getRequest = new GetRequest.Builder().id(Constants.EMS_ADMIN+"_"+user)
                .index(Constants.INDEX_EMS).build();
        GetResponse<EmployeeEntity> searchResponse = esClient.get(getRequest, EmployeeEntity.class);
        if(searchResponse != null && searchResponse.source() != null){
            return searchResponse.source();
        }
        return null;
    }
    public EmployeeEntity getEmployeeById(String user, String company) throws IOException {
        String index = Constants.INDEX_EMS+"_"+company;
        String username = ResourceUtils.generateCompanyResourceId(user);
        String username = md5Hash(user);
        GetRequest getRequest = new GetRequest.Builder().id(Constants.EMPLOYEE+"-"+username)
                .index(index).build();
        GetResponse<EmployeeEntity> searchResponse = esClient.get(getRequest, EmployeeEntity.class);
        if(searchResponse != null && searchResponse.source() != null){
            return searchResponse.source();
        }
        return null;
    }
    private String md5Hash(String user) {
        try {
            // Using Apache Commons Codec for MD5 hashing
            return DigestUtils.md5Hex(user);
        } catch (Exception e) {
            // Handle exceptions, such as NoSuchAlgorithmException
            e.printStackTrace();
            return null; // Or throw an exception based on your error handling strategy
        }
    }
    public void saveOtpToUser(EmployeeEntity user, Long otp, String company) throws IdentityException {
        user.setOtp(otp);
        user.setExpiryTime(Instant.now().plus(40, ChronoUnit.SECONDS).getEpochSecond()); // Set expiry time, for example, 5 minutes from now
        String index =  Constants.INDEX_EMS +"_"+ company; // Use dynamic index
        String id = Constants.EMPLOYEE+"-"+md5Hash(user.getEmailId());
        saveEntity(user,id , index);  // Ensure this method saves the user entity to the correct index
        logger.info("The otp and expiry time saved into the db for index: " + index);
    }//save the entity



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