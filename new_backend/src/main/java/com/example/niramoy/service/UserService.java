package com.example.niramoy.service;


import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    // get all users ; if there is an error then db roll back, if ok then after ending the method it will commit the transaction
    // until then the query result will be stored in persistence context
    @Transactional
    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.getAll();
        return users.stream()
                .map(user -> new UserDTO(user.getId(),user.getUsername(),user.getEmail(),user.getName()))
                .toList();

    }


    public UserDTO createUser() {
        User user = User.builder().username("arafattta")
                .email("arafatttaaaa@gmail.com").password("123456")
                .name("arafaattta").build();
        System.out.println("hi");
        User newUser= userRepository.save(user);
        System.out.println("hi");
        return new UserDTO(newUser.getId(),newUser.getUsername(),newUser.getEmail(),newUser.getName());

    }

    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return new UserDTO(user.getId(),user.getUsername(),user.getEmail(),user.getName());
    }

    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return new UserDTO(user.getId(),user.getUsername(),user.getEmail(),user.getName());
    }
}
