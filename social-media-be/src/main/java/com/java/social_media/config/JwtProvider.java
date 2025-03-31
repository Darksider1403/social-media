package com.java.social_media.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;

import javax.crypto.SecretKey;
import java.util.Date;

public class JwtProvider {
    private static SecretKey secretKey = Keys.hmacShaKeyFor(JwtConstant.JWT_SECRET.getBytes());

    public static String generateToken(Authentication authentication) {
        String jwt = Jwts.builder()
                .issuer("Social Media API")
                .issuedAt(new Date())
                .expiration(new Date(new Date().getTime() + 86400000))
                .claim("email", authentication.getName())
                .signWith(secretKey)
                .compact();

        return jwt;
    }

    public static String getEmailFromJwtToken(String jwt) {
        // Bearer token
        jwt = jwt.substring(7);

        Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(jwt)
                .getBody();

        String email = String.valueOf(claims.get("email"));

        return email;
    }
}
