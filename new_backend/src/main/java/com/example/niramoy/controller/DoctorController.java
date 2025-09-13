package com.example.niramoy.controller;

import com.example.niramoy.dto.DoctorProfileDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.User;
import com.example.niramoy.service.DoctorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorProfileService doctorProfileService;

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
    public ResponseEntity<Map<String, Object>> getPatientData(@RequestBody int patientId){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Patient data retrieved successfully");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }
        User doctor = (User) authentication.getPrincipal();

        Map<String, Object> patientData = doctorProfileService.getPatientData(doctor, patientId);
        response.put("patientData", patientData);
        return ResponseEntity.ok(response);
    }
}
