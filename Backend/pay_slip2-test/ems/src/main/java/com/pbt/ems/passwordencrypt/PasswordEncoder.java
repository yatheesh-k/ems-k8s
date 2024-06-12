package com.pbt.ems.passwordencrypt;

import org.jasypt.util.text.BasicTextEncryptor;
import org.springframework.stereotype.Service;

@Service
public class PasswordEncoder {

    private static final String ENCRYPTION_PASSWORD = "pbt_ems"; // Replace with a strong and secure encryption password

    public String encryptPassword(String plainPassword) {
        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword(ENCRYPTION_PASSWORD);
        return encryptor.encrypt(plainPassword);
    }

    public String decryptPassword(String encryptedPassword) {
        BasicTextEncryptor encryptor = new BasicTextEncryptor();
        encryptor.setPassword(ENCRYPTION_PASSWORD);
        return encryptor.decrypt(encryptedPassword);
    }
}
