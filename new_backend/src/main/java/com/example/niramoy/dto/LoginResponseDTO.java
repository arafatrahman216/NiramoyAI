package com.example.niramoy.dto;


import com.example.niramoy.enumerate.Role;
import lombok.*;

@Data
@AllArgsConstructor
@Builder
@Getter
@Setter
public class LoginResponseDTO {

    String jwt;
    boolean success;
    Long userId;
    Role role;
    UserDTO user;
}
