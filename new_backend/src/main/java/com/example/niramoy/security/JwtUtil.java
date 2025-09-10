package com.example.niramoy.security;


import com.example.niramoy.entity.User;
import com.example.niramoy.enumerate.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Component
public class JwtUtil {

    private final SecretKey secretKey;

    public JwtUtil() {
        this.secretKey = generateSecureKey("secretKey");
        byte[] keyBytes = this.secretKey.getEncoded();
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
    }

    private final long jwtExpiration = 86400000; // 1 hours in milliseconds


    private SecretKey generateSecureKey(String baseKey) {
        try
        {
            // Use SHA-256 to hash the base string, ensuring it's exactly 256 bits
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] keyBytes = digest.digest(baseKey.getBytes(StandardCharsets.UTF_8));
            // Create a secure key from the hashed bytes
            SecretKey skey= Keys.hmacShaKeyFor(keyBytes);
            System.out.println(skey.getEncoded());
            return skey;
        }
        catch (Exception e)
        {
            throw new RuntimeException("Failed to generate secure key: " + e.getMessage(), e);
        }
    }

    public String generateToken(User user) {

        System.out.println("damn");
        String username = user.getUsername();
        Long userId = user.getId();
        Role role = user.getRole();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(secretKey)
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractClaims(token).get("userId", Long.class);
    }

    @SuppressWarnings("unchecked")
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    public boolean validateToken(String token, String userId) {
        try {
            System.out.println("Nope");
            Long tokenUserId = extractUserId(token);
            return tokenUserId.equals(userId) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
