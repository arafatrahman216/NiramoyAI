package com.example.niramoy.service;


import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.User;
import com.example.niramoy.enumerate.Role;
import com.example.niramoy.error.DuplicateUserException;
import com.example.niramoy.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    // get all users ; if there is an error then db roll back, if ok then after ending the method it will commit the transaction
    // until then the query result will be stored in persistence context
    @Transactional
    public List<UserDTO> getAllUsers(){
        List<User> users = userRepository.getAll();
        return users.stream()
                .map(user -> convertToUserDTO(user))
                .toList();
    }

    @Transactional
    public User createUser(Map<String, String> newUser) {
        String username = newUser.get("username");
        String email = newUser.get("email");
        String password = newUser.get("password");
        String name = newUser.get("name");
        String phoneNumber = newUser.get("phoneNumber");
        String gender = newUser.get("gender");
        String foundRole = newUser.get("role");
        Role role = Role.valueOf(foundRole.toUpperCase());

        String profilePictureUrl = newUser.get("profilePictureUrl");
        String status = "ACTIVE";
        LocalDate dateOfBirth = LocalDate.parse(newUser.get("dateOfBirth"));
        User user = userRepository.findUserByUsernameOrEmail(username,email);
        if (user != null) {
            throw new DuplicateUserException("User already exists with username or email: " + username + " or " + email);
        }

        User newUser1 = User.builder().username(username).name(name).email(email).password(password)
                .phoneNumber(phoneNumber).gender(gender).createdAt(LocalDateTime.now())
                .profilePictureUrl(profilePictureUrl)
                .status(status).dateOfBirth(dateOfBirth).role(role)
                .build();
        System.out.println("hi");
        userRepository.save(newUser1);
//        return convertToUserDTO(newUser1);

        return newUser1;
    }

    public UserDTO findByUsername(String username) {
        System.out.println("hey");
        User user = userRepository.findByUsername(username);
        return convertToUserDTO(user);
    }

    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email);
        return convertToUserDTO(user);
    }

    // load user by username for authentication
    @Override
    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("hello");
        User user = userRepository.findByUsernameOrEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return user;
    }

    public User findByUserId(Long userId) {
        return userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));
    }

    public UserDTO convertToUserDTO(User user) {
        UserDTO userDTO = UserDTO.builder().id(user.getId()).username(user.getUsername()).email(user.getEmail())
                .name(user.getName()).phoneNumber(user.getPhoneNumber()).gender(user.getGender())
                .status(user.getStatus()).profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole()).build();
        return userDTO;
    }


    @Transactional
    public UserDTO updateUserProfile(Long id, Map<String, Object> updates) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("phoneNumber")) {
            System.out.println("updating phone number");
            System.out.println(updates.get("phoneNumber"));
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("gender")) {
            user.setGender((String) updates.get("gender"));
        }
        if (updates.containsKey("status")) {
            user.setStatus((String) updates.get("status"));
        }
        if (updates.containsKey("profilePictureUrl")) {
            user.setProfilePictureUrl((String) updates.get("profilePictureUrl"));
        }
        return convertToUserDTO(userRepository.save(user));
        
    }
}
