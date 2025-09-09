// package com.example.NiramoyAI.security;

// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import org.springframework.stereotype.Component;

// import javax.crypto.SecretKey;
// import java.util.Date;
// import java.util.List;

// @Component
// public class JwtUtil {

//     private final SecretKey secretKey;
//     private final long jwtExpiration = 86400000; // 24 hours in milliseconds

//     public JwtUtil() {
//         // Generate a secure key for HS256
//         this.secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
//     }

//     public String generateToken(String username, Long userId, List<String> roles) {
//         Date now = new Date();
//         Date expiryDate = new Date(now.getTime() + jwtExpiration);

//         return Jwts.builder()
//                 .setSubject(username)
//                 .claim("userId", userId)
//                 .claim("roles", roles)
//                 .setIssuedAt(now)
//                 .setExpiration(expiryDate)
//                 .signWith(secretKey)
//                 .compact();
//     }

//     public Claims extractClaims(String token) {
//         return Jwts.parserBuilder()
//                 .setSigningKey(secretKey)
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }

//     public String extractUsername(String token) {
//         return extractClaims(token).getSubject();
//     }

//     public Long extractUserId(String token) {
//         return extractClaims(token).get("userId", Long.class);
//     }

//     @SuppressWarnings("unchecked")
//     public List<String> extractRoles(String token) {
//         return extractClaims(token).get("roles", List.class);
//     }

//     public boolean isTokenExpired(String token) {
//         return extractClaims(token).getExpiration().before(new Date());
//     }

//     public boolean validateToken(String token, String username) {
//         try {
//             String tokenUsername = extractUsername(token);
//             return tokenUsername.equals(username) && !isTokenExpired(token);
//         } catch (JwtException | IllegalArgumentException e) {
//             return false;
//         }
//     }
// }
