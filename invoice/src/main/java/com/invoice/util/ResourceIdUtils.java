package com.invoice.util;

import com.invoice.model.ResourceType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
@Service
@Slf4j
public class ResourceIdUtils {

    public static String generateCustomerResourceId(String email, String mobileNumber) {
        return generateGlobalResourceId(ResourceType.CUSTOMER, email,mobileNumber);
    }

    public static String generateGlobalResourceId(ResourceType type, Object... args) {
        boolean isCaseSensitive = false;
        String prefix = Constants.DEFAULT + "-";

        if (type == ResourceType.CUSTOMER) {
            prefix = Constants.CUSTOMER + "-";
        }

        StringBuilder md5Input = new StringBuilder();
        for (Object arg : args) {
            if (arg != null) {
                if (md5Input.length() == 0) {
                    md5Input.append(arg.toString());
                } else {
                    md5Input.append(":").append(arg.toString());
                }
            }
        }
        String md5Hash;
        if (isCaseSensitive) {
            md5Hash = org.springframework.util.DigestUtils.md5DigestAsHex(md5Input.toString().getBytes()).toLowerCase();

        } else {
            md5Hash = org.springframework.util.DigestUtils.md5DigestAsHex(md5Input.toString().toLowerCase().getBytes()).toLowerCase();

        }
        return prefix + md5Hash;
    }



}