package com.example.niramoy.dto;


import com.example.niramoy.enumerate.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequestDTO {
    private String usernameOrEmail;
    private String password;
}
