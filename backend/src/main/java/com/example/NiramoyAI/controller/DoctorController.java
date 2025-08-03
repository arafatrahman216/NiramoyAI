package com.example.NiramoyAI.controller;

import com.example.NiramoyAI.model.Doctor;
import com.example.NiramoyAI.model.User;
import com.example.NiramoyAI.model.Appointment;
import com.example.NiramoyAI.repository.DoctorRepository;
import com.example.NiramoyAI.repository.AppointmentRepository;
import com.example.NiramoyAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    // Search doctors
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchDoctors(@RequestParam(required = false) String query,
                                                            @RequestParam(required = false) String specialization) {
        try {
            List<Doctor> doctors;
            
            if (query != null && !query.trim().isEmpty()) {
                doctors = doctorRepository.searchDoctors(query.trim());
            } else if (specialization != null && !specialization.trim().isEmpty()) {
                doctors = doctorRepository.findBySpecializationContainingIgnoreCase(specialization.trim());
            } else {
                doctors = doctorRepository.findByIsAvailableTrue();
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("doctors", doctors);
            response.put("total", doctors.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error searching doctors: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get all specializations
    @GetMapping("/specializations")
    public ResponseEntity<Map<String, Object>> getSpecializations() {
        try {
            List<String> specializations = doctorRepository.findAllSpecializations();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("specializations", specializations);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching specializations: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get top rated doctors
    @GetMapping("/top-rated")
    public ResponseEntity<Map<String, Object>> getTopRatedDoctors() {
        try {
            List<Doctor> doctors = doctorRepository.findTopRatedDoctors();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("doctors", doctors);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching top rated doctors: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDoctorById(@PathVariable Long id) {
        try {
            Optional<Doctor> doctorOpt = doctorRepository.findById(id);
            
            if (doctorOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("doctor", doctorOpt.get());
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Doctor not found");
                return ResponseEntity.status(404).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching doctor: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get current doctor profile (for doctor dashboard)
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getDoctorProfile(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            
            if (doctorOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Doctor profile not found");
                return ResponseEntity.status(404).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("doctor", doctorOpt.get());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching doctor profile: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Update doctor profile
    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateDoctorProfile(@RequestBody Map<String, Object> updateData,
                                                                  Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            
            if (doctorOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Doctor profile not found");
                return ResponseEntity.status(404).body(response);
            }

            Doctor doctor = doctorOpt.get();
            
            // Update doctor fields
            if (updateData.containsKey("specialization")) {
                doctor.setSpecialization((String) updateData.get("specialization"));
            }
            if (updateData.containsKey("qualification")) {
                doctor.setQualification((String) updateData.get("qualification"));
            }
            if (updateData.containsKey("experienceYears")) {
                doctor.setExperienceYears((Integer) updateData.get("experienceYears"));
            }
            if (updateData.containsKey("consultationFee")) {
                doctor.setConsultationFee(new java.math.BigDecimal(updateData.get("consultationFee").toString()));
            }
            if (updateData.containsKey("hospitalAffiliation")) {
                doctor.setHospitalAffiliation((String) updateData.get("hospitalAffiliation"));
            }
            if (updateData.containsKey("clinicAddress")) {
                doctor.setClinicAddress((String) updateData.get("clinicAddress"));
            }
            if (updateData.containsKey("phoneNumber")) {
                doctor.setPhoneNumber((String) updateData.get("phoneNumber"));
            }
            if (updateData.containsKey("aboutDoctor")) {
                doctor.setAboutDoctor((String) updateData.get("aboutDoctor"));
            }
            if (updateData.containsKey("isAvailable")) {
                doctor.setIsAvailable((Boolean) updateData.get("isAvailable"));
            }

            doctorRepository.save(doctor);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Doctor profile updated successfully");
            response.put("doctor", doctor);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error updating doctor profile: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get doctor dashboard statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDoctorDashboardStats(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            
            if (doctorOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Doctor profile not found");
                return ResponseEntity.status(404).body(response);
            }

            Doctor doctor = doctorOpt.get();
            
            // Get statistics
            Long totalAppointments = appointmentRepository.countCompletedAppointmentsByDoctor(doctor);
            List<Appointment> todayAppointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, LocalDate.now());
            List<Appointment> upcomingAppointments = appointmentRepository.findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.SCHEDULED);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalCompletedAppointments", totalAppointments);
            stats.put("todayAppointments", todayAppointments.size());
            stats.put("upcomingAppointments", upcomingAppointments.size());
            stats.put("rating", doctor.getRating());
            stats.put("totalReviews", doctor.getTotalReviews());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching dashboard stats: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Get doctor appointments
    @GetMapping("/appointments")
    public ResponseEntity<Map<String, Object>> getDoctorAppointments(Authentication authentication,
                                                                    @RequestParam(required = false) String status,
                                                                    @RequestParam(required = false) String startDate,
                                                                    @RequestParam(required = false) String endDate) {
        try {
            String username = authentication.getName();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (userOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(404).body(response);
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            
            if (doctorOpt.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Doctor profile not found");
                return ResponseEntity.status(404).body(response);
            }

            Doctor doctor = doctorOpt.get();
            List<Appointment> appointments;

            if (status != null && !status.isEmpty()) {
                appointments = appointmentRepository.findByDoctorAndStatus(doctor, Appointment.AppointmentStatus.valueOf(status.toUpperCase()));
            } else if (startDate != null && endDate != null) {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                appointments = appointmentRepository.findByDoctorAndDateRange(doctor, start, end);
            } else {
                appointments = appointmentRepository.findByDoctor(doctor);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("appointments", appointments);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error fetching appointments: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
