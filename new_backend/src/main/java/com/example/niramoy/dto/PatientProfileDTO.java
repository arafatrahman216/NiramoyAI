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
public class PatientProfileDTO {

    private long id;
    private String email;
    private String name ;
    private String phoneNumber;
    private String gender;
    private String status ;
    private String profilePictureUrl;
    private Role role ;
    private String bloodType ;
    private String createdAt ;



}