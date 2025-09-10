package com.example.niramoy.controller;

import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.dto.HealthProfileDTO;
import com.example.niramoy.service.ImageService;
import com.example.niramoy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ImageService imageService;


    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {

        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }
        response.put("success", true);
        response.put("message", "Profile retrieved successfully");
        User user = (User) authentication.getPrincipal();
        UserDTO userDTO = userService.convertToUserDTO(user);
        userDTO.setCreatedAt(user.getCreatedAt().toLocalDate().toString());

        response.put("user", userDTO);
//        response.put("userId", authentication.getName());

//        UserDTO userDTO=
//        response.put("username", authentication.getName());
//        response.put("authorities", authentication.getAuthorities());
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, Object> updates){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }
        User user = (User) authentication.getPrincipal();
        try {
            UserDTO updatedUser = userService.updateUserProfile(user.getId(), updates);
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Profile update failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).body(response);
        }
        
    }


    @PostMapping("/upload-profile")
    public ResponseEntity<Map<String, Object>> uploadProfile(@ModelAttribute MultipartFile image){
        Map<String, Object> request = new HashMap<>();
        request.put("success", false);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            request.put("success", false);
            request.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.ok(request);
        }
        User user = (User) authentication.getPrincipal();
        try {
            String imageUrl = imageService.uploadImage(image);
            request.put("success", true);
            request.put("message", "Profile image uploaded successfully");
            request.put("imageUrl", imageUrl);
            return ResponseEntity.ok(request);
        }
        catch (Exception e) {
            request.put("success", false);
            request.put("message", "Failed to upload profile image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(request);
        }

    }


    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }



    

    @GetMapping("/username")
    public ResponseEntity<UserDTO> findByUsername(@RequestParam("q") String email){
        return ResponseEntity.ok(userService.findByEmail(email));

    }



    @PostMapping("/health-profile")
    public ResponseEntity<HealthProfileDTO> updateHealthProfile(@RequestBody HealthProfileDTO healthProfileDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = (User) authentication.getPrincipal();
        UserDTO userDTO = userService.convertToUserDTO(user);

        System.out.println("Received health profile data: " + healthProfileDTO);
        try {
            HealthProfileDTO savedHealthProfileDTO = userService.updateHealthProfile(userDTO.getId(), healthProfileDTO);
            return ResponseEntity.ok(savedHealthProfileDTO);
        } catch (Exception e) {
            System.err.println("Error updating health profile: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }    

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Test endpoint is working!");
    }

    // @PostMapping("/upload-visit")
    // public ResponseEntity<String> uploadVisit(@RequestBody UploadVisitReqDTO visitDTO){
    //     System.out.println("Received visit data: " + visitDTO);
    //     return ResponseEntity.ok("Visit data received successfully");   
    // }


}
