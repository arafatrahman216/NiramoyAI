package com.example.niramoy.controller;

import com.example.niramoy.dto.DoctorProfileDTO;
import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.dto.VisitDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.User;
import com.example.niramoy.entity.Visits;
import com.example.niramoy.service.DoctorProfileService;
import com.example.niramoy.service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorProfileService doctorProfileService;
    private final VisitService visitService;

//    @GetMapping("/profile")
//    public DoctorProfileDTO createDoctorProfile(@RequestBody DoctorProfileDTO doctorProfileDTO){
//        DoctorProfileDTO doctorProfile = doctorProfileService.createNewDoctor(doctorProfileDTO);
//        return doctorProfile;
//    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getDoctorProfile(){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }
        response.put("success", true);
        response.put("message", "Profile retrieved successfully");
        User user = (User) authentication.getPrincipal();
        DoctorProfileDTO doctor = doctorProfileService.getDoctorProfile(user);
        response.put("doctor", doctor);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateDoctorProfile(@RequestBody Map<String, Object> updates){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Profile updated successfully");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }
        User user = (User) authentication.getPrincipal();
        doctorProfileService.updateProfile(user, updates);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/patient")
    public ResponseEntity<Map<String, Object>> getPatientsData(@RequestBody Map<String, Object> patient){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Patients data retrieved successfully");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }
        User doctor = (User) authentication.getPrincipal();
        Long patientId = Long.parseLong(patient.get("id").toString());

        Map<String, Object> patientsData = doctorProfileService.getPatientData(doctor, patientId);
        response.put("vitals", patientsData.get("healthProfile"));
        response.put("user", patientsData.get("user"));
        response.put("healthLogs", patientsData.get("healthLogs"));
        response.put("visits", patientsData.get("visits"));
        response.put("charts", patientsData.get("charts"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test(){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Test endpoint is working!");
        List<Visits> visits = visitService.getAllVisitsByUser(2L);
        response.put("visits", visits);
        return ResponseEntity.ok(response);

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

        System.out.println(authentication.getAuthorities());
        System.out.println(authentication.getCredentials());
        User doctor = (User) authentication.getPrincipal();
        List<VisitDTO> visits = visitService.getRecentVisitsByDoctor(doctor, 10);
        response.put("success", true);
        response.put("visits", visits);
        return ResponseEntity.ok(response);

    }




}
