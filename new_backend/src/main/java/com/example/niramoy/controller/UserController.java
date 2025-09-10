package com.example.niramoy.controller;

import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.HealthLog;
import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.dto.HealthProfileDTO;
import com.example.niramoy.service.HealthService;
import com.example.niramoy.service.ImageService;
import com.example.niramoy.service.MessageService;
import com.example.niramoy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ImageService imageService;
    private final MessageService messageService;
    private final HealthService healthService;


    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile() {

        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
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

    @GetMapping("chat-sessions")
    public ResponseEntity<HashMap<String, Object>> getChatSessions(){
        HashMap<String, Object> response = new HashMap<>();
        response.put("success", true);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.ok(response);
        }
        User user = (User) authentication.getPrincipal();
        List<ChatSessions> chatSessionsList = user.getChatSession();
        response.put("chatSessions", chatSessionsList);
        return ResponseEntity.ok(response);

    }


    @PostMapping("/chat")
    public ResponseEntity<HashMap<String, Object>> sendMessage(@RequestBody Map<String, String> body){
        HashMap<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to send message");
            return ResponseEntity.ok(response);
        }
        User user = (User) authentication.getPrincipal();
        String message = body.get("message");
        Long chatId = Long.parseLong(body.get("chatId"));
        boolean success = messageService.addMessageToChat(chatId, message);

        response.put("success", success);
        return ResponseEntity.ok(response);

    }

    @PostMapping("/message")
    public  ResponseEntity<HashMap<String,Object>> getAgentMessage(@RequestBody Map<String,String> query){

        HashMap<String,Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to get sessions");
            return ResponseEntity.ok(response);
        }

        Long chatId = Long.parseLong(query.get("chatId") );
        response.put("success", true );
        System.out.println(chatId);
        ChatSessions chatSession = messageService.getMessagesByChatId(chatId); // get the single chat session by chatId
        response.put("data", chatSession.getMessages()); // messages of the distinct chat session(this is what is required)
//        List<ChatSessions> chatSessionsList = new ArrayList<>();
//        for (ChatSessions cs: chatSession.getUser().getChatSession()){ // all chat sessions of the user(no use for now)
//            if (cs.getMessages().size() >0){
//                chatSessionsList.add(cs);
//            }
//        }
//        response.put("chatSessions",chatSessionsList); // chat sessions of the user(no use for now)

        return  ResponseEntity.ok(response);
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


    @GetMapping("/dashboard")
    public ResponseEntity<HashMap<String,Object>> getDashboardStats(){
        HashMap<String,Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        response.put("success", true);
        HealthProfile healthProfile = user.getHealthProfile();
        Page<HealthLog> healthLogs = healthService.findByUser(user, PageRequest.of(0, 10));
        response.put("healthProfile", healthProfile);
        String systolicPressure = healthProfile.getBloodPressure().split("/")[0];
        String diastolicPressure = healthProfile.getBloodPressure().split("/")[1];
        response.put("systolicPressure", systolicPressure);
        response.put("diastolicPressure", diastolicPressure);
        response.put("healthLogs", healthLogs.getContent());
        Map<String, List<Map<String, Object>>> vitals = healthService.transformToVitals(healthLogs.getContent());
        response.put("vitals", vitals);
        return ResponseEntity.ok(response);

    }

    @GetMapping("/health-log")
    public ResponseEntity<Map<String, Object>> getHealthLogs() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = (User) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(0, 10);
        Page<HealthLog> healthLogs = healthService.findByUserOrderByDateDesc(user, pageable);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("healthLogs", healthLogs.getContent());
        response.put("totalPages", healthLogs.getTotalPages());
        response.put("currentPage", healthLogs.getNumber());
        response.put("totalItems", healthLogs.getTotalElements());
        response.put("perPage", healthLogs.getSize());
        return ResponseEntity.ok(response);
    }



    @PostMapping("/vitals")
    public ResponseEntity<Map<String, Object>> createHealthLogVitals(@RequestBody Map<String,Object> vitals){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication== null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        try{
            boolean success = healthService.addNewHealthLog(user, vitals);
            response.put("success", success);
        }
        catch (Exception e){
            response.put("success", false);
            response.put("message", "Failed to save health log: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Test endpoint is working!");
    }


}
