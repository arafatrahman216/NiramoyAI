package com.example.niramoy.controller;


import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.service.DoctorProfileService;
import com.example.niramoy.service.SearchService;
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
                        "You help users find doctors based on their symptoms, location, and specialty title(Orthopedist not Orthopedics). " +
                        "You will give output in strictly JSON format with keys: " +
                        "{ \n \"specialty\": \"...\",\n \"cityName\": \"...\" }" +
                        "If the user provides symptoms, infer the specialty from them. " +
                        "If the user provides a location, extract the city name of Bangladesh " +
                        "If the user does not provide location or symptoms, default to Dhaka, General Physician. " +
                        "Give me only the raw JSON object, no code block, no language tag, no explanation."+
                        "Do not include any explanations or additional text or delimeter(json or ```) outside the JSON brackets ."
//                       + "suggest from these categories : "+ IdMapper.getAllSpecialities()
                , query.get("query"));
        Map<String, Object> response = new HashMap<>();
        Map<String,Object> citySpecialty = JsonParser.parseCityAndSpecialty(aiResponse);
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


}
