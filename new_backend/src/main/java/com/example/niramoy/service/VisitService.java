package com.example.niramoy.service;

import com.example.niramoy.dto.VisitDTO;
import com.example.niramoy.dto.Request.UploadVisitReqDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.entity.Visits;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.DoctorProfileRepository;
import com.example.niramoy.repository.DoctorRepository;
import com.example.niramoy.repository.VisitsRepository;
import com.example.niramoy.service.AIServices.AIService;
import com.example.niramoy.utils.JsonParser;

import dev.langchain4j.model.input.PromptTemplate;

import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.service.AIServices.AIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class VisitService {

    private final VisitsRepository visitsRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserKGService userKGService;

    public UploadVisitReqDTO saveVisitData(
            Long userId,
            String appointmentDate,
            String doctorName,
            String doctorId,
            String symptoms,
            String prescription,
            String prescriptionFileUrl,
            List<String> testReportFileUrls)
    {
        try {
            log.info("Saving visit data for user ID: {}", userId);

            // Find the user
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

            // Parse appointment date (HTML date input sends yyyy-MM-dd format)
            LocalDate parsedAppointmentDate = LocalDate.parse(appointmentDate);

            //Fetching doctor
            Doctor doctor = null ;
            Long fetchedDoctorId = -1L;
            try {
                fetchedDoctorId = Long.parseLong(doctorId);
                doctor = doctorRepository.findByDoctorId(fetchedDoctorId).get();
            } catch (Exception e) {
                log.warn("Doctor with ID {} not found. Proceeding without linking to a doctor entity.", fetchedDoctorId);
            }

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

            // Extrct the entity and relationships and save it to KG
            Boolean kgSavedStatus = userKGService.saveVisitDetails(savedVisit, userId, fetchedDoctorId);
            if(!kgSavedStatus){
                log.error("Failed to save visit data to Knowledge Graph for visit ID: {}", savedVisit.getVisitId());
                throw new RuntimeException("Failed to save visit data to Knowledge Graph");
            }
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

//    @Cacheable(value = "visits", key = "'userId:' + #userId")
    public List<VisitDTO> getRecentVisits(User user, int i) {

        List<Visits> visits = visitsRepository.findByUserOrderByAppointmentDateDesc(user);
        java.util.Collections.reverse(visits);
        
        //FIXME: FIX LIMIT
        i = Math.max(i, visits.size());

        return visits.stream().limit(i).map(v -> {
            Long doctorId =  -1L;
            String doctorName = "";
            if (v.getDoctor() != null) {
                doctorId = v.getDoctor().getDoctorId();
                doctorName = v.getDoctor().getName();
            }
            else {
                doctorName = v.getDoctorName();
            }

            VisitDTO dto = new VisitDTO();
            dto.setVisitId(v.getVisitId());
            dto.setAppointmentDate(v.getAppointmentDate().toString());
            dto.setDoctorName(doctorName);
            dto.setPatientName(user.getName());
            dto.setUserId(user.getId());
            dto.setDoctorId(doctorId);

            dto.setSymptoms(v.getSymptoms());
            dto.setPrescription(v.getPrescription());
            dto.setPrescriptionFileUrl(v.getPrescriptionFileUrl());
            return dto;
        }).toList();

    }

    public List<VisitDTO> getRecentVisitsByDoctor(User doctor, int i) {
        DoctorProfile doctorProfile = doctorProfileRepository.findByUserId(doctor.getId());
        List<Visits> visits = visitsRepository.findByDoctor_DoctorIdOrderByAppointmentDateDesc(doctorProfile.getDoctorId());
        List<VisitDTO> recentVisits = visits.stream().limit(10).map(v -> {
            VisitDTO dto = new VisitDTO();
            dto.setVisitId(v.getVisitId());
            dto.setAppointmentDate(v.getAppointmentDate().toString());
            dto.setDoctorName(v.getDoctorName());
            dto.setPatientName(v.getUser().getName());
            dto.setUserId(v.getUser().getId());
            dto.setDoctorId(v.getDoctor().getDoctorId());
            dto.setSymptoms(v.getSymptoms());
            dto.setPrescription(v.getPrescription());
            dto.setPrescriptionFileUrl(v.getPrescriptionFileUrl());
            return dto;
        }).toList();
        return recentVisits;
    }
}
