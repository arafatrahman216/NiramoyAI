package com.example.niramoy.controller;

import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;


    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile retrieved successfully");
//        UserDTO userDTO=
//        response.put("username", authentication.getName());
//        response.put("authorities", authentication.getAuthorities());
        return ResponseEntity.ok(response);
    }


    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/save")
    public ResponseEntity<UserDTO> addStd(){
        return ResponseEntity.status(HttpStatus.OK).body(userService.createUser());

    }

    @GetMapping("/username")
    public ResponseEntity<UserDTO> findByUsername(@RequestParam("q") String email){
        return ResponseEntity.ok(userService.findByEmail(email));

    }


}
