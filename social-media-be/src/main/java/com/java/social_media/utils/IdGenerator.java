package com.java.social_media.utils;

import java.security.SecureRandom;

public class IdGenerator {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final char[] ID_CHARS = "_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    public static String generateNanoId(int size) {
        char[] id = new char[size];
        for (int i = 0; i < size; i++) {
            id[i] = ID_CHARS[RANDOM.nextInt(ID_CHARS.length)];
        }
        return new String(id);
    }
}