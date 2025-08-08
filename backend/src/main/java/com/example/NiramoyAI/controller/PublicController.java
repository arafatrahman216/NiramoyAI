package com.example.NiramoyAI.controller;

import com.example.NiramoyAI.model.User;
import com.example.NiramoyAI.model.Doctor;
import com.example.NiramoyAI.model.UserRole;
import com.example.NiramoyAI.model.RoleName;
import com.example.NiramoyAI.repository.UserRepository;
import com.example.NiramoyAI.repository.UserRoleRepository;
import com.example.NiramoyAI.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;
    
    @Autowired
    private DoctorRepository doctorRepository;

    // Mock specialties for demonstration
    private final List<String> specialties = Arrays.asList(
        "Cardiologist", "Neurologist", "Pediatrician", "Orthopedic Surgeon", 
        "Gynecologist", "Dermatologist", "Psychiatrist", "General Medicine"
    );

    private final List<String> hospitals = Arrays.asList(
        "Dhaka Medical College Hospital", "Square Hospital", "Apollo Hospital",
        "United Hospital", "Labaid Hospital", "Popular Medical Center"
    );

    @GetMapping("/doctors")
    public ResponseEntity<Map<String, Object>> getAllDoctors() {
        try {
            // Get available doctors from Doctor table
            List<Doctor> doctors = doctorRepository.findByIsAvailableTrue();
            
            // Convert to public doctor data
            List<Map<String, Object>> publicDoctors = doctors.stream()
                    .map(this::convertDoctorToPublicData)
                    .collect(Collectors.toList());

            // Add some hardcoded doctors if no doctor entities exist
            if (publicDoctors.isEmpty()) {
                publicDoctors = createMockDoctors();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", publicDoctors);
            response.put("message", "Doctors retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving doctors: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/doctors/specialty/{specialty}")
    public ResponseEntity<Map<String, Object>> getDoctorsBySpecialty(@PathVariable String specialty) {
        try {
            // Search doctors by specialization using repository method
            List<Doctor> doctors = doctorRepository.findBySpecializationContainingIgnoreCase(specialty);
            
            // Convert to public doctor data
            List<Map<String, Object>> filteredDoctors = doctors.stream()
                    .filter(doctor -> doctor.getIsAvailable()) // Only available doctors
                    .map(this::convertDoctorToPublicData)
                    .collect(Collectors.toList());

            // Fallback to mock data if no real doctors found
            if (filteredDoctors.isEmpty()) {
                List<Map<String, Object>> allDoctors = createMockDoctors();
                filteredDoctors = allDoctors.stream()
                        .filter(doctor -> doctor.get("specialty").toString().toLowerCase()
                                .contains(specialty.toLowerCase()))
                        .collect(Collectors.toList());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", filteredDoctors);
            response.put("message", "Doctors retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving doctors: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/doctors/search")
    public ResponseEntity<Map<String, Object>> searchDoctors(@RequestParam String q) {
        try {
            // Search in Doctor table using the repository method
            List<Doctor> searchResults = doctorRepository.searchDoctors(q);
            
            // Convert to public doctor data
            List<Map<String, Object>> filteredDoctors = searchResults.stream()
                    .map(this::convertDoctorToPublicData)
                    .collect(Collectors.toList());

            // Fallback to mock data if no real doctors found
            if (filteredDoctors.isEmpty()) {
                List<Map<String, Object>> allDoctors = createMockDoctors();
                filteredDoctors = allDoctors.stream()
                        .filter(doctor -> 
                            doctor.get("name").toString().toLowerCase().contains(q.toLowerCase()) ||
                            doctor.get("specialty").toString().toLowerCase().contains(q.toLowerCase()) ||
                            doctor.get("location").toString().toLowerCase().contains(q.toLowerCase())
                        )
                        .collect(Collectors.toList());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", filteredDoctors);
            response.put("message", "Search completed successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error searching doctors: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<Map<String, Object>> getDoctorById(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            Map<String, Object> doctor;
            
            if (userOpt.isPresent()) {
                doctor = convertToPublicDoctor(userOpt.get());
            } else {
                // Return mock doctor if user not found
                List<Map<String, Object>> mockDoctors = createMockDoctors();
                if (id <= mockDoctors.size()) {
                    doctor = mockDoctors.get(id.intValue() - 1);
                } else {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Doctor not found");
                    return ResponseEntity.status(404).body(errorResponse);
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", doctor);
            response.put("message", "Doctor retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error retrieving doctor: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    private Map<String, Object> convertDoctorToPublicData(Doctor doctor) {
        Map<String, Object> publicDoctor = new HashMap<>();
        
        publicDoctor.put("id", doctor.getId());
        publicDoctor.put("name", "Dr. " + doctor.getUser().getFirstName() + " " + doctor.getUser().getLastName());
        publicDoctor.put("specialty", doctor.getSpecialization());
        publicDoctor.put("location", doctor.getHospitalAffiliation() != null ? doctor.getHospitalAffiliation() : "Location not specified");
        publicDoctor.put("phone", doctor.getPhoneNumber() != null ? doctor.getPhoneNumber() : doctor.getUser().getPhoneNumber());
        publicDoctor.put("email", doctor.getUser().getEmail());
        publicDoctor.put("experience", doctor.getExperienceYears() != null ? doctor.getExperienceYears() + " years" : "Experience not specified");
        publicDoctor.put("available", doctor.getIsAvailable());
        publicDoctor.put("rating", doctor.getRating() != null ? doctor.getRating().doubleValue() : 0.0);
        publicDoctor.put("reviews", doctor.getTotalReviews() != null ? doctor.getTotalReviews() : 0);
        publicDoctor.put("verified", doctor.getIsVerified());
        publicDoctor.put("education", doctor.getQualification());
        publicDoctor.put("consultationFee", doctor.getConsultationFee() != null ? doctor.getConsultationFee().doubleValue() : 0.0);
        publicDoctor.put("about", doctor.getAboutDoctor() != null ? doctor.getAboutDoctor() : "No information available");
        publicDoctor.put("image", doctor.getProfileImageUrl() != null ? doctor.getProfileImageUrl() : "/api/placeholder/120/120");
        
        // Add some default values for fields not in the Doctor entity
        publicDoctor.put("languages", Arrays.asList("Bengali", "English")); // Default languages
        publicDoctor.put("achievements", new ArrayList<>()); // Empty achievements list
        
        return publicDoctor;
    }

    private Map<String, Object> convertToPublicDoctor(User user) {
        Map<String, Object> publicDoctor = new HashMap<>();
        Random random = new Random(user.getId()); // Use ID as seed for consistent random data
        
        publicDoctor.put("id", user.getId());
        publicDoctor.put("name", "Dr. " + user.getFirstName() + " " + user.getLastName());
        publicDoctor.put("specialty", specialties.get(random.nextInt(specialties.size())));
        publicDoctor.put("location", hospitals.get(random.nextInt(hospitals.size())));
        publicDoctor.put("phone", user.getPhoneNumber() != null ? user.getPhoneNumber() : "+880-" + (100000000 + random.nextInt(900000000)));
        publicDoctor.put("email", user.getEmail());
        publicDoctor.put("experience", (5 + random.nextInt(20)) + " years");
        publicDoctor.put("available", random.nextBoolean());
        publicDoctor.put("rating", 4.0 + (random.nextDouble() * 1.0)); // Rating between 4.0-5.0
        publicDoctor.put("image", "/api/placeholder/120/120");
        
        return publicDoctor;
    }

    private List<Map<String, Object>> createMockDoctors() {
        List<Map<String, Object>> mockDoctors = new ArrayList<>();
        
        String[][] doctorData = {
            {"Dr. Sarah Johnson", "Cardiologist", "Dhaka Medical College Hospital", "+880-123-456789", "sarah.johnson@hospital.com", "15 years", "true", "4.8"},
            {"Dr. Ahmed Rahman", "Neurologist", "Square Hospital", "+880-987-654321", "ahmed.rahman@square.com", "12 years", "true", "4.9"},
            {"Dr. Fatima Khan", "Pediatrician", "Apollo Hospital", "+880-555-123456", "fatima.khan@apollo.com", "10 years", "false", "4.7"},
            {"Dr. Mohammad Ali", "Orthopedic Surgeon", "United Hospital", "+880-444-789123", "m.ali@united.com", "18 years", "true", "4.6"},
            {"Dr. Rashida Begum", "Gynecologist", "Labaid Hospital", "+880-333-654987", "rashida.begum@labaid.com", "14 years", "true", "4.8"},
            {"Dr. Karim Hassan", "Dermatologist", "Popular Medical Center", "+880-222-789456", "karim.hassan@popular.com", "8 years", "true", "4.5"},
            {"Dr. Nasreen Akter", "Psychiatrist", "Dhaka Medical College Hospital", "+880-111-456789", "nasreen.akter@hospital.com", "11 years", "true", "4.7"},
            {"Dr. Rafiq Ahmed", "General Medicine", "Square Hospital", "+880-666-321987", "rafiq.ahmed@square.com", "20 years", "true", "4.9"}
        };

        for (int i = 0; i < doctorData.length; i++) {
            Map<String, Object> doctor = new HashMap<>();
            doctor.put("id", (long) (i + 1));
            doctor.put("name", doctorData[i][0]);
            doctor.put("specialty", doctorData[i][1]);
            doctor.put("location", doctorData[i][2]);
            doctor.put("phone", doctorData[i][3]);
            doctor.put("email", doctorData[i][4]);
            doctor.put("experience", doctorData[i][5]);
            doctor.put("available", Boolean.parseBoolean(doctorData[i][6]));
            doctor.put("rating", Double.parseDouble(doctorData[i][7]));
            doctor.put("image", "/api/placeholder/120/120");
            mockDoctors.add(doctor);
        }

        return mockDoctors;
    }
}
