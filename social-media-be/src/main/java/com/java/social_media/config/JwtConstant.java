package com.java.social_media.config;

import java.security.SecureRandom;
import java.util.Base64;

public class JwtConstant {
    public static final String JWT_HEADER = "Authorization";
    public static String JWT_SECRET = generateSecretKey();

    private static String generateSecretKey() {
        SecureRandom secureRandom = new SecureRandom();
        byte[] keyBytes = new byte[32]; // 32 bytes = 256 bits
        secureRandom.nextBytes(keyBytes);

        return Base64.getEncoder().encodeToString(keyBytes);
    }

    public static void main(String[] args) {
        System.out.println("Generated JWT_SECRET: " + JWT_SECRET);
    }
}
