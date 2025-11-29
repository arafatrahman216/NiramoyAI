package com.example.niramoy.controller;


import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.service.DoctorProfileService;
import com.example.niramoy.service.QRService;
import com.example.niramoy.service.SearchService;
import com.example.niramoy.service.UserService;
import com.example.niramoy.utils.DoctorScrapper;
import com.example.niramoy.utils.IdMapper;
import com.example.niramoy.utils.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class PublicController {

    private final DoctorProfileService doctorProfileService;
    private  final SearchService searchService;
    private final AIService aiService;
    private final DoctorScrapper doctorScrapper;
    private final QRService qrService;
    private final UserService userService;
    private final UserRepository userRepository;


    @GetMapping("/doctors/search")
    public ResponseEntity<List<DoctorProfile>>
    getDoctorsByQuery( @RequestParam String q){

        return ResponseEntity.status(200).body(doctorProfileService.findDoctorBy(q));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorProfile>>
    getAllDoctors(){

        return ResponseEntity.status(200).body(doctorProfileService.findAllDoctor());
    }


    @GetMapping("/test")
    public String testEndpoint(){
        return searchService.getDoctors("Find the best cardiologist in Netrakona");
    }

    @GetMapping("/health")
    public String healthCheck(){
        return "Service is up and running.";
    }

    @Cacheable(value = "doctorSearchCache", key = "#cityName + '-' + #specialty", unless="#result == null")
    @GetMapping("/search")
    public String searchEndpoint(
            @RequestParam(required = false) String cityName,
            @RequestParam(required = false) String specialty
    ){
        try {
            String json = doctorScrapper.scrapeDoctors(cityName, specialty);
            System.out.println("outside");
            return json;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error fetching data from Sasthya Seba.";
        }

    }

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> executeQuery(@RequestBody Map<String,String> query){
        String aiResponse = aiService.generateContent(
                "You are a Medical Search Assistant. " +
                        "You help users find doctors based on their symptoms, location, and specialty title(Orthopedist, not Orthopedics). " +
                        "You will give output in strictly JSON format with keys: " +
                        "{ \"specialty\": \"...\",\n \"cityName\": \"...\" }" +
                        "If the user provides symptoms, infer the specialty from them. " +
                        "If the user provides a location, extract the city name of Bangladesh " +
                        "If the user does not provide location or symptoms, default to Dhaka, General Physician. " +
                        "Give me only the raw JSON object, no code block, no language tag, no explanation."+
                        "Do not(strictly) include any explanations or additional text or delimeter(json or ```) outside the JSON brackets ."
//                       + "suggest from these categories : "+ IdMapper.getAllSpecialities()
                , query.get("query"));
        Map<String, Object> response = new HashMap<>();
        Map<String,Object> citySpecialty = JsonParser.parseCityAndSpecialty(aiResponse);
        if (citySpecialty.size()==0){
            citySpecialty.put("cityName","Dhaka");
            citySpecialty.put("specialty","General Physician");
        }
        String doctorSuggestion = null ;
        try {
            doctorSuggestion=doctorScrapper.scrapeDoctors(citySpecialty.get("cityName").toString(),citySpecialty.get("specialty").toString());
            System.out.println(doctorSuggestion);
            response.put("doctorSuggestion", JsonParser.parseDoctorSuggestions(doctorSuggestion));
        }
        catch (Exception e) {
            System.out.println(e.getMessage());

        }
        response.put("jsonValue", citySpecialty);
        response.put("success", true);
        response.put("response", aiResponse);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/shared")
    public ResponseEntity<Map<String, Object>> getSharedProfile(@RequestBody Map<String,String> request){
        String encryptedId = request.get("encryptedId");
        String username = "";
        Map<String, Object> response = new HashMap<>();
        long expiryTime = 0;
        response.put("success", false);
        try {
            String decryptedData = qrService.decrypt(encryptedId);
            String[] parts = decryptedData.split("###");
            username = parts[0];
            expiryTime = Long.parseLong(parts[1]);
            long currentTime = System.currentTimeMillis();
            if (currentTime > expiryTime) {
                response.put("message", "Link has expired.");
                response.put("error", "Link expired");
                return ResponseEntity.status(400).body(response);
            }

        } catch (Exception e) {
            response.put("message", "Failed to retrieve shared profile.");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        // If everything is fine, return the user profile
        UserDTO userProfile = userService.findByUsername(username);
        if (userProfile == null) {
            response.put("message", "User not found.");
            response.put("error", "User not found");
            return ResponseEntity.status(404).body(response);
        }
        response = userService.createUserDashboardMap(userRepository.findByUsername(username));
        response.put("success", true);
        response.put("message", "Shared profile retrieved successfully.");
        response.put("user", userProfile);
        response.put("expire", expiryTime);
        
        return ResponseEntity.ok(response);
    }
}
