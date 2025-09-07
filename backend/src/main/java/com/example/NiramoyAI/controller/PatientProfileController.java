package com.example.NiramoyAI.controller;

import com.example.NiramoyAI.dto.HealthRecordDTO;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/patient")
public class PatientProfileController {
    @PostMapping("/health-record")
    public ResponseEntity<HealthRecordDTO> createHealthRecord(@RequestBody HealthRecordDTO healthRecordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        String username = authentication.getName();
        System.out.println("Health record for user: " + username);
        System.out.println("Received health record data: " + healthRecordDTO);
        return ResponseEntity.ok(healthRecordDTO);
    }

    @GetMapping("/test")
    public ResponseEntity<String> getMethodName() {
        System.out.println("Test endpoint hit");
        return ResponseEntity.ok("Test successful");
    }
    
}
