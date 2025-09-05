package com.example.NiramoyAI.controller;


import com.example.NiramoyAI.dto.PrescriptionDTO;
import com.example.NiramoyAI.service.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/upload")
public class ImageController {
    private final ImageService imageService;
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

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

}
