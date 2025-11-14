package com.example.niramoy.controller;

import com.example.niramoy.dto.DoctorProfileDTO;
import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.dto.VisitDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.entity.User;
import com.example.niramoy.entity.Visits;
import com.example.niramoy.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/doctor")
public class DoctorController {

    private final DoctorProfileService doctorProfileService;
    private final VisitService visitService;
    private final QRService qrService;
    private final UserService userService;
    private final ImageService imageService;

    private final String baseUrl = "http://localhost:3000/link/";


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

//    @Cacheable(value = "dr_qr", key = "#doctor.id")
    @GetMapping("/qr")
    public ResponseEntity<Map<String, Object>> getQRLink(){
        Map<String, Object> response = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null. Please login to upload profile image");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        User doctor = (User) authentication.getPrincipal();
        DoctorProfile doctorProfile = doctorProfileService.getDoctorProfileByUserId(doctor.getId());
        System.out.println(doctorProfile);
        log.info("Doctor Profile: {}", doctorProfile);
        String qrUrl, profileLink ;

        if (doctorProfile.getQrUrl() == null || doctorProfile.getQrUrl().isEmpty()){
            String data = doctor.getUsername() +"###"+ System.currentTimeMillis();
            String encryptedData = qrService.encrypt(data);
            profileLink = baseUrl+ (doctor.getUsername()!= null ? encryptedData : "none");
            doctorProfileService.updateProfile(doctor, Map.of("qrUrl", profileLink));
            System.out.println("profile link : " + profileLink);
        }
        else {
            profileLink = doctorProfile.getQrUrl();
        }
        qrUrl = qrService.generateQrCode(profileLink);
        response.put("success", true);
        response.put("link", profileLink);
        response.put("qrImage", qrUrl);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getAppointments(){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Appointments retrieved successfully");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
        }

        User doctor = (User) authentication.getPrincipal();
        List<Map<String, Object>> appointments = doctorProfileService.getDoctorAppointments(doctor);
        response.put("appointments", appointments);
        return ResponseEntity.ok(response);
    }

//    @Cacheable(value = "patient_data", key = "#patient")
    @PostMapping("/patient/data")
    public ResponseEntity<Map<String, Object>> getPatientsInfo(@RequestBody Map<String, Object> patient){
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
        boolean hasPermission = (boolean) patientsData.get("hasPermission");
        if (hasPermission){
            response.put("visits", doctorProfileService.getPatientVisits(patientId));
        }else {
            response.put("visits", patientsData.get("visits"));
        }
        response.put("vitals", patientsData.get("healthProfile"));
        response.put("user", patientsData.get("user"));
        response.put("healthLogs", patientsData.get("healthLogs"));
        response.put("charts", patientsData.get("charts"));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/patients")
    public ResponseEntity<Map<String, Object>> getaccessedPatients(){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Patients retrieved successfully");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
            return ResponseEntity.ok(response);
            
        }
        User doctor = (User) authentication.getPrincipal();
        List<Map<String, Object>> patients = doctorProfileService.getAccessedPatients(doctor);
        response.put("patients", patients);
        return ResponseEntity.ok(response);
        
    }

//    @CachePut(value = "dr_qr", key = "#doctor.id")
    @PutMapping("/qr")
    public ResponseEntity<Map<String, Object>> getNewQrLink(){
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "QR link updated successfully");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            response.put("success", false);
            response.put("message", "Authentication token is null");
        }
        User doctor = (User) authentication.getPrincipal();
        String qrUrl, profileLink ;

        String data = doctor.getUsername() +"###"+ System.currentTimeMillis();
        String encryptedData = qrService.encrypt(data);
        profileLink = baseUrl+ (doctor.getUsername()!= null ? encryptedData : "none");
        doctorProfileService.updateProfile(doctor, Map.of("qrUrl", profileLink));
        System.out.println("profile link : " + profileLink);

        qrUrl = qrService.generateQrCode(profileLink);
        response.put("success", true);
        response.put("link", profileLink);
        response.put("qrImage", qrUrl);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/prescription/create")
    public ResponseEntity<String> createPrescription(@ModelAttribute UploadVisitReqDTO visitDTO){

        log.info("=== UPLOAD VISIT DATA ===");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User doctor = (User) authentication.getPrincipal();
        // here treat doctorId of DTO as userId, so that we dont need to change our existing DTO
        DoctorProfile doctorProfile = doctorProfileService.getDoctorProfileByUserId(doctor.getId());
        Long doctorId = doctorProfile.getDoctorId();
        String appointmentDate = visitDTO.getAppointmentDate();
        String doctorName = visitDTO.getDoctorName();
        String symptoms = visitDTO.getSymptoms();
        String prescription = visitDTO.getPrescription();
        String patientId = visitDTO.getDoctorId();
        System.out.println("patient id : " + patientId);

        User user = userService.findByUserId(Long.parseLong(patientId));
        UserDTO userDTO = userService.convertToUserDTO(user);

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

        log.info("=== UPLOAD SUMMARY ===");
        log.info("Prescription File URL: {}", prescriptionFileUrl != null ? prescriptionFileUrl : "Not uploaded");
        log.info("Visit data processed successfully");


        UploadVisitReqDTO uploadedData = visitService.saveVisitData(
                userDTO.getId(),
//                appointmentDate,
                doctorName,
                String.valueOf(doctorId),
                symptoms,
                prescription,
                prescriptionFileUrl,
                List.of()
        );

        log.info("Visit data saved successfully for user: {}", userDTO.getId());

        return ResponseEntity.ok("Visit data received, files uploaded, and saved successfully. Prescription URL: " + prescriptionFileUrl);

    }

    
}


