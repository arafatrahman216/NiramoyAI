package com.example.niramoy.service;


import com.example.niramoy.dto.LoginRequestDTO;
import com.example.niramoy.dto.LoginResponseDTO;
import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.User;
import com.example.niramoy.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final JwtUtil authUtil;

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        System.out.println("ok");
        System.out.println(loginRequestDTO.getUsernameOrEmail());
        System.out.println(loginRequestDTO.getPassword());


        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequestDTO.getUsernameOrEmail(), loginRequestDTO.getPassword())
            );
            User user = (User) authentication.getPrincipal();
            String token = authUtil.generateToken(user);
            System.out.println("123");
            UserDTO userDTO = userService.convertToUserDTO(user);
            userDTO.setCreatedAt(user.getCreatedAt().toLocalDate().toString());
            System.out.println("456");
            return LoginResponseDTO.builder().success(true)
                    .jwt(token).userId(user.getId()).role(user.getRole()).user(userDTO)
                    .build();
        }
        catch (Exception e){
            throw new UsernameNotFoundException("Invalid username or password");
        }

    }

    public User signup(Map<String, String> user){
        if (user.containsKey("password")){
            user.put("password", passwordEncoder.encode(user.get("password")));
        }
        return userService.createUser(user);

    }
}
