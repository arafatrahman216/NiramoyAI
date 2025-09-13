package com.example.niramoy.controller;


import com.example.niramoy.dto.VisitResponseDTO;
import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.entity.Visits;
import com.example.niramoy.repository.MedicineRepository;
import com.example.niramoy.repository.VisitsRepository;
import com.example.niramoy.service.DoctorProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class PublicController {

    private final DoctorProfileService doctorProfileService;
    private final VisitsRepository visitsRepository;
    private final MedicineRepository medicineRepository;

    @GetMapping("/doctors")
    public ResponseEntity<DoctorProfile>

    getDoctorsByUsername(){

        return ResponseEntity.status(200).body(doctorProfileService.findDoctorByUsername("hasib"));
    }


    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        try {
            // Check if visit exists
            var visitOptional = visitsRepository.findByVisitId(5L);
            if (visitOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("Visit with ID 5 not found");
            }
            
            Visits visits = visitOptional.get();
            
            // Create DTO to avoid JSON serialization issues
            VisitResponseDTO visitDTO = VisitResponseDTO.builder()
                    .visitId(visits.getVisitId())
                    .appointmentDate(visits.getAppointmentDate())
                    .doctorName(visits.getDoctorName())
                    .symptoms(visits.getSymptoms())
                    .prescription(visits.getPrescription())
                    .prescriptionFileUrl(visits.getPrescriptionFileUrl())
                    .testReportUrls(visits.getTestReportUrls())
                    .createdAt(visits.getCreatedAt())
                    .updatedAt(visits.getUpdatedAt())
                    // Don't access user object to avoid lazy loading issues
                    .build();
            
            return ResponseEntity.ok(visitDTO);
            
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    


}
