package com.example.niramoy.controller;

import com.example.niramoy.customExceptions.AgentProcessingException;
import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.dto.VisitDTO;
import com.example.niramoy.entity.ChatSessions;
import com.example.niramoy.entity.HealthLog;
import com.example.niramoy.entity.HealthProfile;
import com.example.niramoy.entity.User;
import com.example.niramoy.entity.Messages;
import com.example.niramoy.dto.HealthProfileDTO;
import com.example.niramoy.service.*;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.dto.HealthLogRecord;
import com.example.niramoy.service.AIServices.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ImageService imageService;
    private final VisitService visitService;
    private final MessageService messageService;
    private final HealthService healthService;
    private final ElevenLabService elevenLabService;



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

    @PostMapping("/start-conversation")
    public ResponseEntity<HashMap<String, Object>> startConversation(){
        HashMap<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to start conversation");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            User user = (User) authentication.getPrincipal();
            ChatSessions newChatSession = messageService.createNewChatSession(user);
            
            response.put("success", true);
            response.put("message", "New chat session created successfully");
            response.put("conversationId", newChatSession.getChatId());
            response.put("chatId", newChatSession.getChatId());
            response.put("createdAt", newChatSession.getCreatedAt());
            response.put("title", newChatSession.getTitle());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to create new chat session: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/chat")
    public ResponseEntity<HashMap<String, Object>> sendMessage(@RequestBody Map<String, String> body){
        HashMap<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to send message");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            User user = (User) authentication.getPrincipal();
            String message = body.get("message");
            String chatIdStr = body.get("chatId");
            String mode = body.get("mode");

            log.info("Received message: {}", message);
            log.info("Received mode: {}", mode);

            if (message == null || message.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Message cannot be empty");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (chatIdStr == null) {
                response.put("success", false);
                response.put("message", "Chat ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Long chatId = Long.parseLong(chatIdStr);
            Long userId = user.getId();
            
            // Process message and get AI reply (synchronous for now, but DB saves are async internally)
            Messages aiReply = messageService.sendMessageAndGetReply(chatId, message, mode, userId);

            response.put("success", true);
            response.put("message", "Message sent and processed successfully");
            response.put("userMessage", Map.of(
                "content", message,
                "isAgent", false,
                "chatId", chatId
            ));
            response.put("aiResponse", Map.of(
                "messageId", aiReply.getMessageId(),
                "content", aiReply.getContent(),
                "isAgent", aiReply.isAgent(),
                "chatId", chatId
            ));
            
            return ResponseEntity.ok(response);
        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid chat ID format");
            return ResponseEntity.badRequest().body(response);
        } catch (AgentProcessingException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        } catch (Exception e) {
            log.error("Error processing message: ", e);
            response.put("success", false);
            response.put("message", "Failed to process message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
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


    public ResponseEntity<HashMap<String, Object>> createChatSession(@RequestBody Map<String, Object> body){
        HashMap<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
        }
        User user = (User) authentication.getPrincipal() ;


        return ResponseEntity.ok(response);

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            HashMap<String,Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        HashMap<String,Object> response = userService.createUserDashboardMap(user );
        response.put("success", true);
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
        return ResponseEntity.ok("healthLogRecord");
    }

    @PostMapping("/upload-visit")
    public ResponseEntity<String> uploadVisit(@ModelAttribute UploadVisitReqDTO visitDTO){
        try {

            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();   
            UserDTO userDTO = userService.convertToUserDTO(user);
        
            String appointmentDate = visitDTO.getAppointmentDate();
            String doctorName = visitDTO.getDoctorName();
            String symptoms = visitDTO.getSymptoms();
            String prescription = visitDTO.getPrescription();
            String doctorId = visitDTO.getDoctorId();
            System.out.println("doctor id : " + doctorId);

            String prescriptionFileUrl = null;
            // Check if prescription file is present and upload it
            if (visitDTO.getPrescriptionFile() != null && !visitDTO.getPrescriptionFile().isEmpty()) {
                log.info("Prescription file found: {}", visitDTO.getPrescriptionFile().getOriginalFilename());
                try {
                    prescriptionFileUrl = imageService.uploadImage(visitDTO.getPrescriptionFile());
                    log.info("Prescription file uploaded successfully. URL: {}", prescriptionFileUrl);
                } catch (Exception e) {
                    log.error("Error uploading prescription file: {}", e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Error uploading prescription file: " + e.getMessage());
                }
            } else {
                log.warn("No prescription file provided");
            }
            
            List<String> testReportFileUrl = new ArrayList<>();
            if (visitDTO.getTestReports() != null && !visitDTO.getTestReports().isEmpty()) {
                for (MultipartFile testReport : visitDTO.getTestReports()) {
                    log.info("Test report file found: {}", testReport.getOriginalFilename());
                    try {
                        String testReportUrl = imageService.uploadImage(testReport);
                        testReportFileUrl.add(testReportUrl);
                    } catch (Exception e) {
                        log.error("Error uploading test report file: {}", e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("Error uploading test report file: " + e.getMessage());
                    }
                }
            } else {
                log.warn("No test report file provided");
            }

            log.info("=== UPLOAD SUMMARY ===");
            log.info("Prescription File URL: {}", prescriptionFileUrl != null ? prescriptionFileUrl : "Not uploaded");
            log.info("Test Report File URL: {}", testReportFileUrl != null ? testReportFileUrl : "Not uploaded");
            log.info("Visit data processed successfully");
    

            UploadVisitReqDTO uploadedData = visitService.saveVisitData(
                                                            userDTO.getId(),
                                                            appointmentDate,
                                                            doctorName,
                                                            doctorId,
                                                            symptoms,
                                                            prescription,
                                                            prescriptionFileUrl,
                                                            testReportFileUrl
                                                        );

            log.info("Visit data saved successfully for user: {}", userDTO.getId());

            return ResponseEntity.ok("Visit data received, files uploaded, and saved successfully. Prescription URL: " + prescriptionFileUrl);
            
        } catch (Exception e) {
            log.error("Error in upload-visit endpoint: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing visit data: " + e.getMessage());
        }
    }


    @PostMapping("/audio-log")
    public ResponseEntity<Map<String, Object>> uploadAudio(@ModelAttribute MultipartFile audio) {
        try {
            String transcription = elevenLabService.transcribeAudio(audio);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("text", transcription);
            System.out.println(transcription);
            HealthLogRecord healthLogRecord = healthService.getLogFromTranscription(transcription);
            response.put("healthLogRecord", healthLogRecord);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/recent-visits")
    public ResponseEntity<Map<String, Object>> getRecentVisits(){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);

        }
        User user = (User) authentication.getPrincipal();
        List<VisitDTO> recentVisits = visitService.getRecentVisits(user, 10);
        response.put("success", true);
        response.put("recentVisits", recentVisits);
        return ResponseEntity.ok(response);
        
    }


}
