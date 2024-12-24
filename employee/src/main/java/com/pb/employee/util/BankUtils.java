package com.pb.employee.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pb.employee.exception.EmployeeException;
import com.pb.employee.persistance.model.*;
import com.pb.employee.request.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

@Slf4j
@Component
public class BankUtils {


    public static BankEntity maskCompanyBankProperties(BankRequest bankRequest, String resourceId, String companyId) {
        // Declare masked variables
        String accountNumber = null, ifscCode = null, address = null,
                accountType = null,branch =null,bankName =null,state=null;

        // Masking bank details
        if (bankRequest.getAccountNumber() != null) {
            accountNumber = Base64.getEncoder().encodeToString(bankRequest.getAccountNumber().getBytes());
        }
        if (bankRequest.getIfscCode() != null) {
            ifscCode = Base64.getEncoder().encodeToString(bankRequest.getIfscCode().getBytes());
        }
        if (bankRequest.getAddress() != null) {
            address = Base64.getEncoder().encodeToString(bankRequest.getAddress().getBytes());
        }
        if (bankRequest.getBranch() != null) {
            // Masking the branch name as an example
            branch = Base64.getEncoder().encodeToString(bankRequest.getBranch().getBytes());
        }
        if (bankRequest.getAccountType() != null) {
            // Masking the branch name as an example
            accountType = Base64.getEncoder().encodeToString(bankRequest.getAccountType().getBytes());
        }

        if (bankRequest.getBankName() != null) {
            // Masking the state information
            bankName = Base64.getEncoder().encodeToString(bankRequest.getBankName().getBytes());
        }
        ObjectMapper objectMapper = new ObjectMapper();

        BankEntity bankEntity = objectMapper.convertValue(bankRequest, BankEntity.class);
        bankEntity.setId(resourceId); // Set the resource ID
        bankEntity.setCompanyId(companyId); // Associate with the company
        bankEntity.setAccountNumber(accountNumber); // Set the masked account number
        bankEntity.setIfscCode(ifscCode); // Set the masked IFSC code
        bankEntity.setBranch(branch); // Set the masked IFSC code
        bankEntity.setBankName(bankName); // Set the masked IFSC code
        bankEntity.setAccountType(accountType); // Set the masked IFSC code
        bankEntity.setAddress(address); // Set the masked address (or branch/state if needed)
        bankEntity.setType(Constants.BANK); // Assuming the type is "BANK"

        // Add any other fields that need masking and setting...

        return bankEntity;
    }


}