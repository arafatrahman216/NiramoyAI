// package com.example.NiramoyAI.security;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import java.io.IOException;
// import java.util.List;
// import java.util.stream.Collectors;

// @Component
// public class JwtAuthenticationFilter extends OncePerRequestFilter {

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//             throws ServletException, IOException {

//         String authHeader = request.getHeader("Authorization");

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             String token = authHeader.substring(7);
            
//             try {
//                 String username = jwtUtil.extractUsername(token);
                
//                 if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//                     if (jwtUtil.validateToken(token, username)) {
//                         List<String> roles = jwtUtil.extractRoles(token);
//                         List<SimpleGrantedAuthority> authorities = roles.stream()
//                                 .map(SimpleGrantedAuthority::new)
//                                 .collect(Collectors.toList());

//                         UsernamePasswordAuthenticationToken authToken = 
//                                 new UsernamePasswordAuthenticationToken(username, null, authorities);
                        
//                         SecurityContextHolder.getContext().setAuthentication(authToken);
//                     }
//                 }
//             } catch (Exception e) {
//                 // Invalid token, continue without authentication
//             }
//         }

//         filterChain.doFilter(request, response);
//     }
// }
