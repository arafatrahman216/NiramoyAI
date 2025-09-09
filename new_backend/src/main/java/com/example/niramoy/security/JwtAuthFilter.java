package com.example.niramoy.security;


import com.example.niramoy.entity.User;
import com.example.niramoy.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil authUtil;
    private final UserService userService;
    private final HandlerExceptionResolver handlerExceptionResolver;
    // this method will be called for every request
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            log.info("Request URL: {}", request.getRequestURL());
            final String path = request.getServletPath() ;
            // skip the auth endpoints jwt checking
            if (path.startsWith("/auth") || path.startsWith("/public") || path.startsWith("/upload") ){
                filterChain.doFilter(request, response);
                return;
            }
            final String tokenHeader = request.getHeader("Authorization");
            if (tokenHeader == null || ! tokenHeader.startsWith("Bearer ")) {
                log.info("Authorization Header: {}", tokenHeader);
//                filterChain.doFilter(request, response);
//                return;
                throw new Exception("JWT Token Missing or Invalid");
            }
            String jwtoken = tokenHeader.split("Bearer ")[1];
            log.info("JWT Token: {}", jwtoken);
            Long userId = authUtil.extractUserId(jwtoken);
            log.info("Extracted User ID: {}", userId);
            if (userId != null) {
                log.info("User ID is not null");
                User user = userService.findByUserId(userId);
                //            System.out.println(user);
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(user, null, authorities);

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                log.info("Authentication Token: {}", authenticationToken);
                log.info("Authentication Token User: {}", authenticationToken.getPrincipal());
                filterChain.doFilter(request, response);

            } else {
                log.info("User ID is null");
                filterChain.doFilter(request, response);
                throw new Exception("Invalid JWT Token");
            }
        }
        catch (Exception e) {

            log.error("Failed to authenticate user: {}", e.getMessage());
            handlerExceptionResolver.resolveException(request, response, null, e);
        }
    }
}
