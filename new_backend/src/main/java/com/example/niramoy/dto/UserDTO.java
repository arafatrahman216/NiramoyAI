package com.example.niramoy.dto;

import com.example.niramoy.enumerate.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserDTO {
    private long id;
    private String username ;
    private String email;
    private String name ;
    private String phoneNumber;
    private String gender;
    private String status ;
    private String profilePictureUrl;
    private Role role ;
    private String createdAt ;


    public UserDTO(long id, String username, String email, String name, String phoneNumber, String gender, String status, String profilePictureUrl, Role role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.status = status;
        this.profilePictureUrl = profilePictureUrl;
        this.role = role;
        this.createdAt = "12-12-2002";
    }


}
