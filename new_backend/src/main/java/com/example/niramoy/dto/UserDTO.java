package com.example.niramoy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.stereotype.Component;


@Data
@AllArgsConstructor

public class UserDTO {
    private long id;
    private String username ;
    private String email;
    private String name ;

}
