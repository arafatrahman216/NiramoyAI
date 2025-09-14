package com.example.niramoy.service;

import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.Visits;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.DoctorRepository;
import com.example.niramoy.repository.VisitsRepository;
import com.example.niramoy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitsRepository visitsRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public UploadVisitReqDTO saveVisitData(
            Long userId,
            String appointmentDate,
            String doctorName,
            String symptoms,
            String prescription,
            String prescriptionFileUrl,
            List<String> testReportFileUrls) {

        try {
            log.info("Saving visit data for user ID: {}", userId);

            // Find the user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Parse appointment date (HTML date input sends yyyy-MM-dd format)
            LocalDate parsedAppointmentDate = LocalDate.parse(appointmentDate);

            Doctor doctor = doctorRepository.findByDoctorId(1L).get();
            // Create and save visit entity
            Visits visit = Visits.builder()
                    .appointmentDate(parsedAppointmentDate)
                    .doctorName(doctorName)
                    .doctor(doctor) // Temporary fix: use doctor ID 1 as default (TODO: implement doctor lookup by name)
                    .symptoms(symptoms)
                    .prescription(prescription)
                    .prescriptionFileUrl(prescriptionFileUrl)
                    .testReportUrls(testReportFileUrls)
                    .user(user)
                    .build();

            Visits savedVisit = visitsRepository.save(visit);
            log.info("Visit saved successfully with ID: {}", savedVisit.getVisitId());

            // Return DTO with saved data for confirmation
            return UploadVisitReqDTO.builder()
                    .appointmentDate(appointmentDate)
                    .doctorName(doctorName)
                    .symptoms(symptoms)
                    .prescription(prescription)
                    .build();

        } catch (Exception e) {
            log.error("Error saving visit data: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save visit data: " + e.getMessage());
        }
    }

    public List<Visits> getAllVisitsByUser(Long userId) {
        return visitsRepository.findByUserIdOrderByAppointmentDateDesc(userId);
    }

    public List<Visits> getAllVisitsByUser(User user) {
        return visitsRepository.findByUserOrderByAppointmentDateDesc(user);
    }
}
