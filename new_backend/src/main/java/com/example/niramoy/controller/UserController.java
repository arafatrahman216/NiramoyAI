package com.example.niramoy.controller;

import com.example.niramoy.customExceptions.AgentProcessingException;
import com.example.niramoy.dto.*;
import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.entity.*;
import com.example.niramoy.service.*;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.repository.ChatSessionRepository;
import com.example.niramoy.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

import org.json.JSONObject;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

import static com.example.niramoy.utils.JsonParser.objectMapper;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
@RequestMapping("/user")
public class UserController {

    private final UserService userService;
    private final ImageService imageService;
    private final VisitService visitService;
    private final MessageService messageService;
    private final HealthService healthService;
    private final ElevenLabService elevenLabService;
    private final QRService qrService;
    private final UserKGService userKGService;

    //FIXME : Has to refactor these into a service 
    private final ChatSessionRepository chatSessionRepository;
    private final MessageRepository messageRepository;



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
        List<ChatSessionDTO> chatSessionDTOs = messageService.getChatSessionDtoByUser(user);

//        response.put("chatSessions", chatSessionsList);
        response.put("chatSessions", chatSessionDTOs);
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
            ChatSessionDTO newChatSession = messageService.createNewChatSession(user);
            
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
    public ResponseEntity<HashMap<String, Object>> sendMessage(@RequestBody Map<String, Object> body){
        HashMap<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to send message");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            User user = (User) authentication.getPrincipal();
            String message = (String) body.get("message");
            String chatIdStr = (String) body.get("chatId");
            String mode = (String) body.get("mode");
            
            //CONTEXT: Extract previous messages and visit context if provided
            @SuppressWarnings("unchecked")
            List<Map<String, String>> previousMessages = (List<Map<String, String>>) body.get("previousMessages");
            
            @SuppressWarnings("unchecked")
            Map<String, Object> visitContext = (Map<String, Object>) body.get("visitContext");

            log.info("Received message: {}", message);
            log.info("Received mode: {}", mode);
            // log.info("Previous messages count: {}", previousMessages != null ? previousMessages.size() : 0);
            // log.info("Visit context provided: {}", visitContext != null);

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
            
            //CONTEXT: Build context prompt from previous messages and visit context
            String contextPrompt = buildContextPrompt(previousMessages, visitContext);
            String fullMessage = contextPrompt.isEmpty() ? message : contextPrompt + "\n\nCurrent User Query: " + message;
            
            log.info("\nFull message with context: {}", fullMessage);
            

            //FIXME : Refactor in service
            // Save user message to database
            ChatSessions chatSession = chatSessionRepository.findChatSessionsByChatId(chatId);
            Messages userMessage = Messages.builder()
                    .content(message)
                    .isAgent(false)
                    .isPlan(false)
                    .chatSession(chatSession)
                    .build();
            messageRepository.save(userMessage);

            // Process message and get AI reply (with context)
            Messages aiReply = messageService.sendMessageAndGetReply(chatId, fullMessage, mode, userId);

            response.put("success", true);
            response.put("message", "Message sent and processed successfully");
            response.put("userMessage", Map.of(
                "content", message,
                "isAgent", false,
                "chatId", chatId,
                "isPlan", false
            ));
            response.put("aiResponse", Map.of(
                "messageId", aiReply.getMessageId(),
                "content", aiReply.getContent(),
                "isAgent", aiReply.isAgent(),
                "chatId", chatId,
                "isPlan", aiReply.getIsPlan()
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
            response.put("aiResponse", Map.of(
                    "messageId", null,
                    "content", "Failed to get response: " + e.getMessage(),
                    "isAgent", true,
                    "chatId", body.get("chatId")
            ));
            response.put("message", "Failed to process message: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/message")
    public  ResponseEntity<HashMap<String,Object>> getMessages(@RequestBody Map<String,String> query){

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
        List<Messages> messages = messageService.getMessagesByChatId(chatId); // get the single chat session by chatId
        List<Map<String,Object>> messageMaps = messageService.convertToMessageMap(messages);
        System.out.println(messageMaps);
        response.put("data", messages); // messages of the distinct chat session(this is what is required)
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

    @PostMapping("/audio")
    public ResponseEntity<Map<String, Object>> uploadAudioAndSaveLog(@ModelAttribute MultipartFile audio) {
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        try {
            String transcription = elevenLabService.transcribeAudio(audio);
            response.put("success", true);
            response.put("text", transcription);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to transcribe audio: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
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

    @PostMapping(value = "/tts", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<byte[]> getSpeech(@RequestBody String text) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new RuntimeException("Authentication token is null. Please login to get speech");
        }
        User user = (User) authentication.getPrincipal();
        byte[] audio = elevenLabService.generateTextToSpeech( text);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"speech.mp3\"")
                .contentType(MediaType.valueOf("audio/mpeg"))
                .body(audio);

    }


    @GetMapping("/HELLO")
    public ResponseEntity<String> hello(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication token is null. Please login to upload profile image");
        }
        return ResponseEntity.ok("Hello, Niramoy User!");
    }


    @PostMapping("/chat-attachment")
    public ResponseEntity<HashMap<String, Object>> sendMessageWithAttachment(
            @RequestParam("message") String message,
            @RequestParam("chatId") String chatId,
            @RequestParam("mode") String mode,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        
        HashMap<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to send messages");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();
        Long chatIdLong;
        try {
            chatIdLong = Long.parseLong(chatId);
        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid chat ID format");
            return ResponseEntity.badRequest().body(response);
        }
        String fileUrl = null;
        Messages aiReply = messageService.sendMessageAndGetReplyWithAttachment(chatIdLong, message, attachment, mode, userId);
        response.put("success", true);
        response.put("message", "Message with attachment sent and processed successfully");
        response.put("userMessage", Map.of(
            "content", message,
            "isAgent", false,
            "chatId", chatIdLong,
            "isPlan", false,
            "attachmentLink", aiReply.getAttachmentLink()
        ));
        response.put("aiResponse", Map.of(
            "messageId", aiReply.getMessageId(),
            "content", aiReply.getContent(),
            "isAgent", aiReply.isAgent(),
            "chatId", chatIdLong,
            "isPlan", aiReply.getIsPlan(),
                "attachmentLink", aiReply.getAttachmentLink()
        ));
        return ResponseEntity.ok(response);

    }


    @GetMapping("/profile/share")
    public ResponseEntity<Map<String, Object>> getShareableLink(){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        UserDTO profile = userService.convertToUserDTO(user);
        response.put("success", true);
        response.put("message", "Shareable link generated successfully" );
        String data = profile.getUsername() + "###" + (System.currentTimeMillis() + 24*60*60*1000); // 1 day expiry
        
        //FIXME : Fix hardcoded url
        String profileLink = "https://niramoyai.netlify.app/shared/profile/" + (profile.getUsername() != null ? qrService.encrypt(data): "user123");
        response.put("link", profileLink);
        response.put("user", qrService.decrypt(qrService.encrypt(data)));
        response.put("expire", qrService.decrypt(qrService.encrypt(data)).split("###")[1]);
        response.put("qrImage",  qrService.generateQrCode(profileLink));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/medicines")
    public ResponseEntity<Map<String,Object>> getMedicines (){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        response.put("success", true);
        List<Medicine> medicines = userService.getMedicinesByUserId(user.getId());
        response.put("medicines",medicines);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<Map<String,Object>> deleteMedicine (@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        boolean deleted = userService.deleteMedicineByIdAndUserId(id, user.getId());
        if (deleted){
            response.put("success", true);
            response.put("message", "Medicine deleted successfully");
        }
        else {
            response.put("success", false);
            response.put("message", "Failed to delete medicine. Medicine not found or does not belong to user");
        }
        return ResponseEntity.ok(response);
    }


    //CONTEXT: Endpoint to get visit details by visit ID from Knowledge Graph
    @GetMapping("/visit/{visitId}")
    public ResponseEntity<Map<String, Object>> getVisitDetails(@PathVariable Long visitId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            log.info("Fetching visit details for visit ID: {}", visitId);
            
            // Fetch visit context from Knowledge Graph
            VisitContextDTO visitData = userKGService.getVisitContextByID(visitId);
            
            if (visitData == null) {
                log.warn("Visit not found with ID: {}", visitId);
                response.put("success", false);
                response.put("message", "Visit not found with ID: " + visitId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            
            response.put("success", true);
            response.put("data", visitData);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching visit details: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Failed to fetch visit details: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }




    //CONTEXT: Helper method to build context prompt from previous messages and visit context
    private String buildContextPrompt(List<Map<String, String>> previousMessages, Map<String, Object> visitContext) {
        StringBuilder prompt = new StringBuilder();
        
        // Add previous conversation context
        if (previousMessages != null && !previousMessages.isEmpty()) {
            prompt.append("Previous conversation:\n");
            for (Map<String, String> msg : previousMessages) {
                String role = msg.getOrDefault("role", "user").toUpperCase();
                String content = msg.getOrDefault("content", "");
                if (!content.isEmpty()) {
                    prompt.append(role).append(": ").append(content).append("\n");
                }
            }
            prompt.append("\n");
        }
        
        // Add visit context
        if (visitContext != null) {
            prompt.append("Relevant Visit Information:\n");
            
            if (visitContext.containsKey("visitId")) {
                prompt.append("Visit ID: ").append(visitContext.get("visitId")).append("\n");
            }
            if (visitContext.containsKey("doctorName")) {
                prompt.append("Doctor: ").append(visitContext.get("doctorName")).append("\n");
            }
            if (visitContext.containsKey("appointmentDate")) {
                prompt.append("Date: ").append(visitContext.get("appointmentDate")).append("\n");
            }
            if (visitContext.containsKey("diagnosis") && visitContext.get("diagnosis") != null) {
                prompt.append("Diagnosis: ").append(visitContext.get("diagnosis")).append("\n");
            }
            if (visitContext.containsKey("symptoms") && visitContext.get("symptoms") != null) {
                Object symptomsObj = visitContext.get("symptoms");
                if (symptomsObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> symptoms = (List<String>) symptomsObj;
                    if (!symptoms.isEmpty()) {
                        prompt.append("Symptoms: ").append(String.join(", ", symptoms)).append("\n");
                    }
                } else {
                    // Handle as string
                    prompt.append("Symptoms: ").append(symptomsObj.toString()).append("\n");
                }
            }
            if (visitContext.containsKey("prescription") && visitContext.get("prescription") != null) {
                Object prescriptionObj = visitContext.get("prescription");
                if (prescriptionObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> prescription = (List<String>) prescriptionObj;
                    if (!prescription.isEmpty()) {
                        prompt.append("Prescription: ").append(String.join(", ", prescription)).append("\n");
                    }
                } else {
                    // Handle as string
                    prompt.append("Prescription: ").append(prescriptionObj.toString()).append("\n");
                }
            }
            if (visitContext.containsKey("summary") && visitContext.get("summary") != null) {
                prompt.append("Summary: ").append(visitContext.get("summary")).append("\n");
            }
            
            prompt.append("\n");
        }
        
        return prompt.toString();
    }

    @GetMapping("/medical-summary")
    public ResponseEntity<Map<String,Object>> getMedicalSummary (){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User user = (User) authentication.getPrincipal();
        response.put("success", true);
        JSONObject medicalSummary = userService.generateMedicalSummary(user.getId());
        log.info("Medical Summary JSON: {}", medicalSummary.toString(4));
        // Map<
        response.put("medicalSummary", medicalSummary.toMap());
        return ResponseEntity.ok(response);
    }
    


    // @GetMapping("/visit-context")
}

