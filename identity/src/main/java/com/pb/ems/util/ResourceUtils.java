    package com.pb.ems.util;

    import lombok.extern.slf4j.Slf4j;
    import org.apache.commons.codec.digest.DigestUtils;
    import org.springframework.stereotype.Component;
    import org.springframework.stereotype.Service;

    @Component
    @Service
    @Slf4j
    public class ResourceUtils {


        public static String generateCompanyResourceId(String... args) {
            return md5Hash(args, true); // Case-sensitive for company names
        }

        public static String md5Hash(Object[] args, boolean isCaseSensitive) {
            try {
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
                if (!isCaseSensitive) {
                    md5Hash = org.springframework.util.DigestUtils.md5DigestAsHex(md5Input.toString().getBytes()).toLowerCase();

                } else {
                    md5Hash = org.springframework.util.DigestUtils.md5DigestAsHex(md5Input.toString().toLowerCase().getBytes()).toLowerCase();

                }

                // Using Apache Commons Codec for MD5 hashing
                return md5Hash;
            } catch (Exception e) {
                // Handle exceptions, such as NoSuchAlgorithmException
                e.printStackTrace();
                return null; // Or throw an exception based on your error handling strategy
            }
        }


    }