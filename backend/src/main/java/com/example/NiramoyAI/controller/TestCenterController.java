package com.example.NiramoyAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/public/test-centers")
@CrossOrigin(origins = "*")
public class TestCenterController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTestCenters() {
        try {
            List<Map<String, Object>> testCenters = createMockTestCenters();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", testCenters);
            response.put("message", "Test centers retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving test centers: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchTestCenters(@RequestParam String q) {
        try {
            List<Map<String, Object>> allTestCenters = createMockTestCenters();
            List<Map<String, Object>> filteredTestCenters = allTestCenters.stream()
                    .filter(center -> 
                        center.get("name").toString().toLowerCase().contains(q.toLowerCase()) ||
                        center.get("location").toString().toLowerCase().contains(q.toLowerCase()) ||
                        center.get("services").toString().toLowerCase().contains(q.toLowerCase())
                    )
                    .collect(ArrayList::new, (list, item) -> list.add(item), (list1, list2) -> list1.addAll(list2));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", filteredTestCenters);
            response.put("message", "Search completed successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error searching test centers: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTestCenterById(@PathVariable Long id) {
        try {
            List<Map<String, Object>> testCenters = createMockTestCenters();
            
            if (id <= 0 || id > testCenters.size()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Test center not found");
                return ResponseEntity.status(404).body(errorResponse);
            }

            Map<String, Object> testCenter = testCenters.get(id.intValue() - 1);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", testCenter);
            response.put("message", "Test center retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving test center: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    private List<Map<String, Object>> createMockTestCenters() {
        List<Map<String, Object>> testCenters = new ArrayList<>();
        
        String[][] centerData = {
            {"Labaid Diagnostic Center", "Dhanmondi, Dhaka", "+880-2-8616815", "Blood Test, X-Ray, MRI, CT Scan, Ultrasound", "8:00 AM - 10:00 PM", "4.7"},
            {"Popular Diagnostic Centre", "Shantinagar, Dhaka", "+880-2-8312345", "Blood Test, ECG, Echo, X-Ray, Ultrasound", "7:00 AM - 11:00 PM", "4.8"},
            {"Ibn Sina Diagnostic Center", "Kallyanpur, Dhaka", "+880-2-9005525", "Blood Test, CT Scan, MRI, X-Ray, Pathology", "24 Hours", "4.6"},
            {"Square Diagnostic Center", "Panthapath, Dhaka", "+880-2-8159457", "Blood Test, Digital X-Ray, CT Scan, MRI, Mammography", "8:00 AM - 9:00 PM", "4.9"},
            {"Medinova Medical Center", "Malibagh, Dhaka", "+880-2-8312289", "Blood Test, Ultrasound, ECG, X-Ray", "6:00 AM - 12:00 AM", "4.5"},
            {"Delta Medical Centre", "Mirpur, Dhaka", "+880-2-8056789", "Blood Test, CT Scan, X-Ray, Ultrasound, Endoscopy", "7:00 AM - 10:00 PM", "4.4"},
            {"Central Hospital Diagnostic", "Uttara, Dhaka", "+880-2-8951234", "Blood Test, MRI, CT Scan, X-Ray, Nuclear Medicine", "24 Hours", "4.6"},
            {"United Diagnostic Center", "Gulshan, Dhaka", "+880-2-8823456", "Blood Test, Digital X-Ray, Ultrasound, ECG, TMT", "8:00 AM - 8:00 PM", "4.7"}
        };

        for (int i = 0; i < centerData.length; i++) {
            Map<String, Object> center = new HashMap<>();
            center.put("id", (long) (i + 1));
            center.put("name", centerData[i][0]);
            center.put("location", centerData[i][1]);
            center.put("phone", centerData[i][2]);
            center.put("services", Arrays.asList(centerData[i][3].split(", ")));
            center.put("hours", centerData[i][4]);
            center.put("rating", Double.parseDouble(centerData[i][5]));
            center.put("image", "/api/placeholder/150/100");
            center.put("emergency", centerData[i][4].contains("24 Hours"));
            
            // Add sample pricing (in BDT)
            Map<String, Integer> pricing = new HashMap<>();
            pricing.put("Blood Test", 500 + (i * 50));
            pricing.put("X-Ray", 800 + (i * 100));
            pricing.put("Ultrasound", 1200 + (i * 150));
            pricing.put("CT Scan", 3500 + (i * 200));
            pricing.put("MRI", 8000 + (i * 500));
            center.put("pricing", pricing);
            
            testCenters.add(center);
        }

        return testCenters;
    }
}
