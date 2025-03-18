package com.pb.employee.util;

import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

public class PasswordUtils {

    public static String generateDefaultPassword() {
        int length = 8;
        String upperCase = Constants.UPPER;
        String lowerCase = Constants.LOWER;
        String digits = Constants.DIGITS;
        String specialChars = Constants.SPECIAL_CHARACTER;
        String allChars = upperCase + lowerCase + digits + specialChars;

        StringBuilder password = new StringBuilder();

        Random rnd = new Random();

        // Ensure at least one of each required character type
        password.append(upperCase.charAt(rnd.nextInt(upperCase.length())));
        password.append(lowerCase.charAt(rnd.nextInt(lowerCase.length())));
        password.append(digits.charAt(rnd.nextInt(digits.length())));
        password.append(specialChars.charAt(rnd.nextInt(specialChars.length())));

        // Fill the remaining slots with random characters from allChars
        for (int i = 4; i < length; i++) {
            password.append(allChars.charAt(rnd.nextInt(allChars.length())));
        }

        // Shuffle the characters so the pattern isn’t predictable
        List<Character> passwordChars = password.chars()
                .mapToObj(c -> (char) c)
                .collect(Collectors.toList());
        Collections.shuffle(passwordChars);

        StringBuilder finalPassword = new StringBuilder();
        passwordChars.forEach(finalPassword::append);

        return finalPassword.toString();
    }

}
