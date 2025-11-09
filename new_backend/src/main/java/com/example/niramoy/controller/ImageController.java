package com.example.niramoy.controller;


import com.example.niramoy.dto.PrescriptionDTO;
import com.example.niramoy.entity.User;
import com.example.niramoy.service.ImageService;
import com.example.niramoy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@RequestMapping("/upload")
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/prescription")
    public ResponseEntity<Map<String, Object>> uploadPrescription(@ModelAttribute PrescriptionDTO prescriptionDTO) {
        try {
            MultipartFile image = prescriptionDTO.getImage();
            String doctorName = prescriptionDTO.getDoctorName();
            String symptoms = prescriptionDTO.getSymptoms();
            String prescription = prescriptionDTO.getPrescription();
            String appointmentDate = prescriptionDTO.getAppointmentDate();
            System.out.println(appointmentDate);
            System.out.println(prescription);
            System.out.println(doctorName);
            System.out.println(symptoms);

            if (image.isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "No image file provided");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String result = imageService.uploadImage(image);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Image uploaded successfully");
            response.put("imageId", result);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload image: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }


    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadProfile(@ModelAttribute MultipartFile image){
        Map<String, Object> request = new HashMap<>();
        request.put("success", false);
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


}
