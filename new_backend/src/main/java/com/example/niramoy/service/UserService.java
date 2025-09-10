package com.example.niramoy.service;

import com.example.niramoy.dto.HealthProfileDTO;
import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.entity.User;
import com.example.niramoy.enumerate.Role;
import com.example.niramoy.error.DuplicateUserException;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.repository.HealthProfileRepository;
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
    private final HealthProfileRepository healthProfileRepository;

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

    
    @Transactional
    public HealthProfileDTO updateHealthProfile(Long userId, HealthProfileDTO healthProfileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        HealthProfile healthProfile = healthProfileRepository.findByUserId(userId);
        
        if (healthProfile != null) {
            updateHealthProfileFields(healthProfile, healthProfileDTO);
            healthProfile = healthProfileRepository.save(healthProfile);
        }
        else {
            // Create new health profile
            healthProfile = new HealthProfile();
            healthProfile.setUserId(userId);
            healthProfile.setUser(user); // Set the User entity reference
            updateHealthProfileFields(healthProfile, healthProfileDTO);
            // Only save for new entities

            System.out.println("This is the health profile to be saved: " + healthProfile);
            healthProfile = healthProfileRepository.save(healthProfile);
        }

        return convertToHealthProfileDTO(healthProfile);
    }




    private void updateHealthProfileFields(HealthProfile healthProfile, HealthProfileDTO dto) {
        healthProfile.setGender(dto.getGender());
        healthProfile.setDateOfBirth(dto.getDateOfBirth());
        healthProfile.setWeight(dto.getWeight());
        healthProfile.setHeight(dto.getHeight());
        healthProfile.setHeartRate(dto.getHeartRate());
        healthProfile.setBloodPressure(dto.getBloodPressure());
        healthProfile.setBloodType(dto.getBloodType());
        healthProfile.setMajorHealthEvents(dto.getMajorHealthEvents());
        healthProfile.setCalculatedAge(dto.getCalculatedAge());
        
        // Convert List<String> to JSON strings
        healthProfile.setLifestyle(dto.getLifestyle() != null ? String.join(",", dto.getLifestyle()) : null);
        healthProfile.setAllergies(dto.getAllergies() != null ? String.join(",", dto.getAllergies()) : null);
        healthProfile.setMajorEvents(dto.getMajorEvents() != null ? String.join(",", dto.getMajorEvents()) : null);
        healthProfile.setChronicDiseases(dto.getChronicDiseases() != null ? String.join(",", dto.getChronicDiseases()) : null);
    }

    private HealthProfileDTO convertToHealthProfileDTO(HealthProfile healthProfile) {
        HealthProfileDTO dto = new HealthProfileDTO();
        dto.setGender(healthProfile.getGender());
        dto.setDateOfBirth(healthProfile.getDateOfBirth());
        dto.setWeight(healthProfile.getWeight());
        dto.setHeight(healthProfile.getHeight());
        dto.setHeartRate(healthProfile.getHeartRate());
        dto.setBloodPressure(healthProfile.getBloodPressure());
        dto.setBloodType(healthProfile.getBloodType());
        dto.setMajorHealthEvents(healthProfile.getMajorHealthEvents());
        dto.setCalculatedAge(healthProfile.getCalculatedAge());
        
        // Convert comma-separated strings back to List<String>
        dto.setLifestyle(healthProfile.getLifestyle() != null ? 
            List.of(healthProfile.getLifestyle().split(",")) : List.of());
        dto.setAllergies(healthProfile.getAllergies() != null ? 
            List.of(healthProfile.getAllergies().split(",")) : List.of());
        dto.setMajorEvents(healthProfile.getMajorEvents() != null ? 
            List.of(healthProfile.getMajorEvents().split(",")) : List.of());
        dto.setChronicDiseases(healthProfile.getChronicDiseases() != null ? 
            List.of(healthProfile.getChronicDiseases().split(",")) : List.of());
        
        return dto;
    }






}
