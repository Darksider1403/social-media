package com.java.social_media.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class OAuth2Config {
    public static final String GOOGLE_CLIENT_ID;
    public static final String GOOGLE_CLIENT_SECRET;

    static {
        GOOGLE_CLIENT_ID = "1016607327591-vi3u6b6elgpj5npjm036sem7kg50o1h3.apps.googleusercontent.com";
        GOOGLE_CLIENT_SECRET = "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";
    }
}
