package com.example.NiramoyAI.controller;

import com.example.NiramoyAI.model.Appointment;
import com.example.NiramoyAI.model.Doctor;
import com.example.NiramoyAI.model.DoctorSchedule;
import com.example.NiramoyAI.model.User;
import com.example.NiramoyAI.repository.AppointmentRepository;
import com.example.NiramoyAI.repository.DoctorRepository;
import com.example.NiramoyAI.repository.DoctorScheduleRepository;
import com.example.NiramoyAI.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    @Autowired
    private UserRepository userRepository;

    // Book a new appointment (Patient)
    @PostMapping("/book")
    public ResponseEntity<Map<String, Object>> bookAppointment(@RequestBody Map<String, Object> request) {
        try {
            // Get current authenticated user
            String username = getCurrentUsername();
            Optional<User> patientOpt = userRepository.findByUsername(username);
            
            if (!patientOpt.isPresent()) {
                return createErrorResponse("Patient not found");
            }
            User patient = patientOpt.get();
            Long doctorId = Long.valueOf(request.get("doctorId").toString());
            String dateStr = request.get("appointmentDate").toString();
            String timeStr = request.get("appointmentTime").toString();
            String symptoms = request.getOrDefault("symptoms", "").toString();
            String consultationType = request.getOrDefault("consultationType", "IN_PERSON").toString();

            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Doctor doctor = doctorOpt.get();
            LocalDate appointmentDate = LocalDate.parse(dateStr);
            LocalTime appointmentTime = LocalTime.parse(timeStr);

            // Check for conflicts
            List<Appointment> conflicts = appointmentRepository.findConflictingAppointments(
                doctor, appointmentDate, appointmentTime);
            
            if (!conflicts.isEmpty()) {
                return createErrorResponse("Time slot already booked");
            }

            // Create appointment
            Appointment appointment = new Appointment(patient, doctor, appointmentDate, appointmentTime);
            appointment.setSymptoms(symptoms);
            appointment.setConsultationType(Appointment.ConsultationType.valueOf(consultationType));
            appointment.setConsultationFee(doctor.getConsultationFee());

            appointment = appointmentRepository.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment booked successfully");
            response.put("appointment", convertAppointmentToMap(appointment));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error booking appointment: " + e.getMessage());
        }
    }

    // Get patient's appointments
    @GetMapping("/patient/my-appointments")
    public ResponseEntity<Map<String, Object>> getPatientAppointments() {
        try {
            String username = getCurrentUsername();
            Optional<User> patientOpt = userRepository.findByUsername(username);
            
            if (!patientOpt.isPresent()) {
                return createErrorResponse("Patient not found");
            }

            User patient = patientOpt.get();
            List<Appointment> appointments = appointmentRepository.findByPatient(patient);

            List<Map<String, Object>> appointmentMaps = appointments.stream()
                    .map(this::convertAppointmentToMap)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentMaps);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error fetching appointments: " + e.getMessage());
        }
    }

    // Get doctor's appointments
    @GetMapping("/doctor/my-appointments")
    public ResponseEntity<Map<String, Object>> getDoctorAppointments() {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor profile not found");
            }

            Doctor doctor = doctorOpt.get();
            List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);

            List<Map<String, Object>> appointmentMaps = appointments.stream()
                    .map(this::convertAppointmentToMap)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentMaps);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error fetching appointments: " + e.getMessage());
        }
    }

    // Get today's appointments for doctor
    @GetMapping("/doctor/today")
    public ResponseEntity<Map<String, Object>> getTodaysAppointments() {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor profile not found");
            }

            Doctor doctor = doctorOpt.get();
            LocalDate today = LocalDate.now();
            List<Appointment> appointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, today);

            List<Map<String, Object>> appointmentMaps = appointments.stream()
                    .map(this::convertAppointmentToMap)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentMaps);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error fetching today's appointments: " + e.getMessage());
        }
    }

    // Get doctor's schedule for a date range
    @GetMapping("/doctor/appointment-schedule")
    public ResponseEntity<Map<String, Object>> getDoctorAppointmentSchedule(
            @RequestParam String startDate, 
            @RequestParam String endDate) {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor profile not found");
            }

            Doctor doctor = doctorOpt.get();
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);

            List<Appointment> appointments = appointmentRepository.findByDoctorAndDateRange(doctor, start, end);

            List<Map<String, Object>> appointmentMaps = appointments.stream()
                    .map(this::convertAppointmentToMap)
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", appointmentMaps);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error fetching schedule: " + e.getMessage());
        }
    }

    // Update appointment status
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<Map<String, Object>> updateAppointmentStatus(
            @PathVariable Long appointmentId, 
            @RequestBody Map<String, String> request) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (!appointmentOpt.isPresent()) {
                return createErrorResponse("Appointment not found");
            }

            Appointment appointment = appointmentOpt.get();
            String newStatus = request.get("status");
            
            appointment.setStatus(Appointment.AppointmentStatus.valueOf(newStatus));
            if (request.containsKey("prescription")) {
                appointment.setPrescription(request.get("prescription"));
            }
            if (request.containsKey("notes")) {
                appointment.setNotes(request.get("notes"));
            }

            appointment = appointmentRepository.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment updated successfully");
            response.put("appointment", convertAppointmentToMap(appointment));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error updating appointment: " + e.getMessage());
        }
    }

    // Cancel appointment
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelAppointment(@PathVariable Long appointmentId) {
        try {
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            if (!appointmentOpt.isPresent()) {
                return createErrorResponse("Appointment not found");
            }

            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
            appointment = appointmentRepository.save(appointment);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Appointment cancelled successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error cancelling appointment: " + e.getMessage());
        }
    }

    // Get available time slots for a doctor on a specific date
    @GetMapping("/doctor/{doctorId}/available-slots")
    public ResponseEntity<Map<String, Object>> getAvailableTimeSlots(
            @PathVariable Long doctorId, 
            @RequestParam String date) {
        try {
            Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Doctor doctor = doctorOpt.get();
            LocalDate appointmentDate = LocalDate.parse(date);

            // Get all appointments for this doctor on this date
            List<Appointment> existingAppointments = appointmentRepository.findByDoctorAndAppointmentDate(doctor, appointmentDate);
            Set<LocalTime> bookedTimes = existingAppointments.stream()
                    .filter(apt -> apt.getStatus() != Appointment.AppointmentStatus.CANCELLED)
                    .map(Appointment::getAppointmentTime)
                    .collect(Collectors.toSet());

            // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
            List<String> availableSlots = new ArrayList<>();
            LocalTime startTime = LocalTime.of(9, 0);
            LocalTime endTime = LocalTime.of(17, 0);

            LocalTime current = startTime;
            while (current.isBefore(endTime)) {
                if (!bookedTimes.contains(current)) {
                    availableSlots.add(current.toString());
                }
                current = current.plusMinutes(30);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("availableSlots", availableSlots);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return createErrorResponse("Error fetching available slots: " + e.getMessage());
        }
    }

    // Helper methods
    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        return ResponseEntity.badRequest().body(errorResponse);
    }

    private ResponseEntity<Map<String, Object>> createSuccessResponse(String message, Object data) {
        Map<String, Object> successResponse = new HashMap<>();
        successResponse.put("success", true);
        successResponse.put("message", message);
        successResponse.put("data", data);
        return ResponseEntity.ok().body(successResponse);
    }

    private Map<String, Object> convertAppointmentToMap(Appointment appointment) {
        Map<String, Object> appointmentMap = new HashMap<>();
        appointmentMap.put("id", appointment.getId());
        appointmentMap.put("appointmentDate", appointment.getAppointmentDate().toString());
        appointmentMap.put("appointmentTime", appointment.getAppointmentTime().toString());
        appointmentMap.put("status", appointment.getStatus().toString());
        appointmentMap.put("consultationType", appointment.getConsultationType().toString());
        appointmentMap.put("symptoms", appointment.getSymptoms());
        appointmentMap.put("notes", appointment.getNotes());
        appointmentMap.put("prescription", appointment.getPrescription());
        appointmentMap.put("consultationFee", appointment.getConsultationFee());
        appointmentMap.put("createdAt", appointment.getCreatedAt().toString());

        // Patient details
        Map<String, Object> patientMap = new HashMap<>();
        patientMap.put("id", appointment.getPatient().getId());
        patientMap.put("name", appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName());
        patientMap.put("email", appointment.getPatient().getEmail());
        patientMap.put("phone", appointment.getPatient().getPhoneNumber());
        appointmentMap.put("patient", patientMap);

        // Doctor details
        Map<String, Object> doctorMap = new HashMap<>();
        doctorMap.put("id", appointment.getDoctor().getId());
        doctorMap.put("name", "Dr. " + appointment.getDoctor().getUser().getFirstName() + " " + appointment.getDoctor().getUser().getLastName());
        doctorMap.put("specialization", appointment.getDoctor().getSpecialization());
        doctorMap.put("hospitalAffiliation", appointment.getDoctor().getHospitalAffiliation());
        appointmentMap.put("doctor", doctorMap);

        return appointmentMap;
    }

    // Doctor Schedule Management Endpoints

    // Get doctor's schedule
    @GetMapping("/doctor/schedule")
    public ResponseEntity<Map<String, Object>> getDoctorSchedule() {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            System.out.println("Fetching schedule for user: " + username);
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Doctor doctor = doctorOpt.get();
            try {
                List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor(doctor);
                return createSuccessResponse("Schedule retrieved successfully", schedules);
            } catch (Exception enumError) {
                // Clean up corrupted data and return empty schedule
                System.out.println("Cleaning up corrupted schedule data: " + enumError.getMessage());
                cleanupCorruptedScheduleData(doctor);
                return createSuccessResponse("Schedule retrieved successfully", new ArrayList<>());
            }
        } catch (Exception e) {
            return createErrorResponse("Failed to retrieve schedule: " + e.getMessage());
        }
    }

    // Helper method to clean up corrupted schedule data
    private void cleanupCorruptedScheduleData(Doctor doctor) {
        try {
            // Delete all corrupted schedule entries for this doctor using native query
            doctorScheduleRepository.deleteByDoctor(doctor);
            System.out.println("Cleaned up corrupted schedule data for doctor: " + doctor.getId());
        } catch (Exception e) {
            System.out.println("Error during cleanup: " + e.getMessage());
        }
    }

    // Create doctor schedule
    @PostMapping("/doctor/schedule")
    public ResponseEntity<Map<String, Object>> createDoctorSchedule(@RequestBody Map<String, Object> request) {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Doctor doctor = doctorOpt.get();
            
            // Parse request data
            @SuppressWarnings("unchecked")
            List<String> daysOfWeek = (List<String>) request.get("daysOfWeek");
            String startTimeStr = request.get("startTime").toString();
            String endTimeStr = request.get("endTime").toString();
            Integer consultationDuration = Integer.valueOf(request.get("consultationDuration").toString());
            Integer maxPatientsPerSlot = Integer.valueOf(request.get("maxPatientsPerSlot").toString());
            Double consultationFee = Double.valueOf(request.get("consultationFee").toString());
            Boolean isAvailable = Boolean.valueOf(request.get("isAvailable").toString());

            LocalTime startTime = LocalTime.parse(startTimeStr);
            LocalTime endTime = LocalTime.parse(endTimeStr);

            List<DoctorSchedule> createdSchedules = new ArrayList<>();

            // Create schedule for each selected day
            for (String dayStr : daysOfWeek) {
                DoctorSchedule schedule = new DoctorSchedule();
                schedule.setDoctor(doctor);
                schedule.setDayOfWeek(DoctorSchedule.DayOfWeek.valueOf(dayStr));
                schedule.setStartTime(startTime);
                schedule.setEndTime(endTime);
                schedule.setConsultationDuration(consultationDuration);
                schedule.setMaxPatientsPerSlot(maxPatientsPerSlot);
                schedule.setConsultationFee(java.math.BigDecimal.valueOf(consultationFee));
                schedule.setIsAvailable(isAvailable);

                DoctorSchedule savedSchedule = doctorScheduleRepository.save(schedule);
                createdSchedules.add(savedSchedule);
            }
            
            return createSuccessResponse("Schedule created successfully", createdSchedules);
        } catch (Exception e) {
            return createErrorResponse("Failed to create schedule: " + e.getMessage());
        }
    }

    // Update doctor schedule
    @PutMapping("/doctor/schedule/{scheduleId}")
    public ResponseEntity<Map<String, Object>> updateDoctorSchedule(
            @PathVariable Long scheduleId, 
            @RequestBody Map<String, Object> request) {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Optional<DoctorSchedule> scheduleOpt = doctorScheduleRepository.findById(scheduleId);
            if (!scheduleOpt.isPresent()) {
                return createErrorResponse("Schedule not found");
            }

            DoctorSchedule schedule = scheduleOpt.get();
            
            // Verify the schedule belongs to the current doctor
            if (!schedule.getDoctor().getId().equals(doctorOpt.get().getId())) {
                return createErrorResponse("Unauthorized to modify this schedule");
            }

            // Update schedule fields
            if (request.containsKey("startTime")) {
                schedule.setStartTime(LocalTime.parse(request.get("startTime").toString()));
            }
            if (request.containsKey("endTime")) {
                schedule.setEndTime(LocalTime.parse(request.get("endTime").toString()));
            }
            if (request.containsKey("consultationDuration")) {
                schedule.setConsultationDuration(Integer.valueOf(request.get("consultationDuration").toString()));
            }
            if (request.containsKey("maxPatientsPerSlot")) {
                schedule.setMaxPatientsPerSlot(Integer.valueOf(request.get("maxPatientsPerSlot").toString()));
            }
            if (request.containsKey("consultationFee")) {
                schedule.setConsultationFee(java.math.BigDecimal.valueOf(Double.valueOf(request.get("consultationFee").toString())));
            }
            if (request.containsKey("isAvailable")) {
                schedule.setIsAvailable(Boolean.valueOf(request.get("isAvailable").toString()));
            }

            DoctorSchedule updatedSchedule = doctorScheduleRepository.save(schedule);
            
            return createSuccessResponse("Schedule updated successfully", updatedSchedule);
        } catch (Exception e) {
            return createErrorResponse("Failed to update schedule: " + e.getMessage());
        }
    }

    // Delete doctor schedule
    @DeleteMapping("/doctor/schedule/{scheduleId}")
    public ResponseEntity<Map<String, Object>> deleteDoctorSchedule(@PathVariable Long scheduleId) {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Optional<DoctorSchedule> scheduleOpt = doctorScheduleRepository.findById(scheduleId);
            if (!scheduleOpt.isPresent()) {
                return createErrorResponse("Schedule not found");
            }

            DoctorSchedule schedule = scheduleOpt.get();
            
            // Verify the schedule belongs to the current doctor
            if (!schedule.getDoctor().getId().equals(doctorOpt.get().getId())) {
                return createErrorResponse("Unauthorized to delete this schedule");
            }

            doctorScheduleRepository.delete(schedule);
            
            return createSuccessResponse("Schedule deleted successfully", null);
        } catch (Exception e) {
            return createErrorResponse("Failed to delete schedule: " + e.getMessage());
        }
    }

    // Doctor creates appointment for patient
    @PostMapping("/doctor/create-appointment")
    public ResponseEntity<Map<String, Object>> createAppointmentForPatient(
            @RequestBody Map<String, Object> appointmentData) {
        try {
            String username = getCurrentUsername();
            Optional<User> userOpt = userRepository.findByUsername(username);
            
            if (!userOpt.isPresent()) {
                return createErrorResponse("User not found");
            }

            Optional<Doctor> doctorOpt = doctorRepository.findByUser(userOpt.get());
            if (!doctorOpt.isPresent()) {
                return createErrorResponse("Doctor not found");
            }

            Doctor doctor = doctorOpt.get();

            // Get patient by username or email
            String patientIdentifier = (String) appointmentData.get("patientIdentifier");
            Optional<User> patientUserOpt = userRepository.findByUsername(patientIdentifier);
            if (!patientUserOpt.isPresent()) {
                patientUserOpt = userRepository.findByEmail(patientIdentifier);
            }
            
            if (!patientUserOpt.isPresent()) {
                return createErrorResponse("Patient not found");
            }

            User patientUser = patientUserOpt.get();

            // Create appointment
            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patientUser);
            appointment.setAppointmentDate(LocalDate.parse((String) appointmentData.get("appointmentDate")));
            appointment.setAppointmentTime(LocalTime.parse((String) appointmentData.get("appointmentTime")));
            appointment.setSymptoms((String) appointmentData.get("symptoms"));
            appointment.setStatus(Appointment.AppointmentStatus.valueOf((String) appointmentData.getOrDefault("status", "SCHEDULED")));
            
            String consultationType = (String) appointmentData.getOrDefault("consultationType", "IN_PERSON");
            appointment.setConsultationType(Appointment.ConsultationType.valueOf(consultationType));
            
            appointment.setCreatedAt(LocalDateTime.now());
            appointment.setConsultationFee(doctor.getConsultationFee());

            Appointment savedAppointment = appointmentRepository.save(appointment);
            
            return createSuccessResponse("Appointment created successfully", convertAppointmentToMap(savedAppointment));
        } catch (Exception e) {
            return createErrorResponse("Failed to create appointment: " + e.getMessage());
        }
    }
}
