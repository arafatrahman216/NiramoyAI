package com.example.niramoy.service;


import com.example.niramoy.entity.HealthLog;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.HealthLogRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static java.lang.Integer.parseInt;


@Service
@RequiredArgsConstructor
public class HealthService {

    private final HealthLogRepository healthLogRepository;

    public Page<HealthLog> findByUser(User user, Pageable pageable) {
        return healthLogRepository.findByUser(user, pageable);
    }

    public Page<HealthLog> findByUserOrderByDateDesc(User user, Pageable pageable) {
        return healthLogRepository.findByUserOrderByLogDatetimeDesc(user, pageable);
    }

    @Transactional
    public boolean addNewHealthLog( User user ,Map<String, Object> formData) {
        try{
            String systolic = safeGetString(formData, "blood_pressure_systolic", "120");
            String diastolic = safeGetString(formData, "blood_pressure_diastolic", "80");
            System.out.println(diastolic);

            Integer heartRate = safeGetInt(formData, "heart_rate", 72);
            Double bloodSugar = safeGetDouble(formData, "blood_sugar", 7.0);
            System.out.println(bloodSugar);

            String logDatetime = "";
            String logDate = safeGetString(formData, "log_date", null);
            String logTime = safeGetString(formData, "log_time", null);
            if (logDate != null && logTime != null) {
                logDatetime = logDate + "T" + logTime + ":00";
            }

            Double oxygenSaturation = safeGetDouble(formData, "oxygen_saturation", 100.0);
            Integer stressLevel = safeGetInt(formData, "stress_level", 0);
            Double weight = safeGetDouble(formData, "weight", user.getHealthProfile().getWeight());

            String note = safeGetString(formData, "notes", "");

            Double temperature = safeGetDouble(formData, "temperature", 98.6);
            System.out.println(temperature);

            List<String> otherSymptoms = (List<String>) formData.get("symptoms");
            if (otherSymptoms == null) otherSymptoms = List.of();

            System.out.println("hi2");

            HealthLog healthLog = HealthLog.builder()
                    .bloodPressure(systolic + "/" + diastolic)
                    .heartRate(heartRate)
                    .bloodSugar(bloodSugar)
                    .logDatetime(LocalDateTime.parse(logDatetime))
                    .oxygenSaturation(oxygenSaturation)
                    .stressLevel(stressLevel)
                    .weight(weight).temperature(temperature)
                    .note(note).user(user)
                    .otherSymptoms(otherSymptoms)
                    .build();
            System.out.println(healthLog.toString());
            healthLogRepository.save(healthLog);
            return true;
        }
        catch (Exception e){
            throw new RuntimeException("Failed to save health log: " + e.getMessage(), e);
        }
    }




    // --- Utility Methods ---
    private String safeGetString(Map<String, Object> formData, String key, String defaultValue) {
        String value = (String) formData.get(key);
        return (value == null || value.isEmpty()) ? defaultValue : value;
    }

    private Integer safeGetInt(Map<String, Object> formData, String key, Integer defaultValue) {
        try {
            String value = (String) formData.get(key);
            return (value == null || value.isEmpty()) ? defaultValue : Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private Double safeGetDouble(Map<String, Object> formData, String key, Double defaultValue) {
        try {
            String value = (String) formData.get(key);
            return (value == null || value.isEmpty()) ? defaultValue : Double.parseDouble(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }



    public Map<String, List<Map<String, Object>>> transformToVitals(List<HealthLog> healthLogs) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        healthLogs = new ArrayList<>(healthLogs);
        try {
            healthLogs.sort(Comparator.comparing(
                    HealthLog::getLogDatetime,
                    Comparator.nullsFirst(Comparator.naturalOrder())
            ));
        } catch (Exception e) {
            System.out.println("Error sorting: " + e.getMessage());
            e.printStackTrace();
        }
        // Blood Pressure
        List<Map<String, Object>> bloodPressure = healthLogs.stream()
                .filter(log -> log.getBloodPressure() != null)
                .map(log -> {
                    String[] parts = log.getBloodPressure().split("/");
                    Long healthLogId = log.getHealthLogId();
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", log.getLogDatetime().format(formatter));
                    System.out.println(log.getLogDatetime().format(formatter));
                    map.put("systolic", parseInt(parts[0]));
                    map.put("diastolic", parseInt(parts[1]));
                    map.put("healthLogId", healthLogId);
                    return map;
                })
                .collect(Collectors.toList());

        // Diabetes (Blood Sugar)
        List<Map<String, Object>> diabetes = healthLogs.stream()
                .filter(log -> log.getBloodSugar() != null)
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    Long healthLogId = log.getHealthLogId();
                    map.put("healthLogId", healthLogId);
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("sugar", log.getBloodSugar());
                    return map;
                })
                .collect(Collectors.toList());

        // Heart Rate
        List<Map<String, Object>> heartRate = healthLogs.stream()
                .filter(log -> log.getHeartRate() != null)
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    Long healthLogId = log.getHealthLogId();
                    map.put("healthLogId", healthLogId);
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("bpm", log.getHeartRate());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> temperature = healthLogs.stream()
                .filter(log -> log.getTemperature() != null)
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    Long healthLogId = log.getHealthLogId();
                    map.put("healthLogId", healthLogId);
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("temp", log.getTemperature());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> oxygenSaturation = healthLogs.stream()
                .filter(log -> log.getOxygenSaturation() != null)
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    Long healthLogId = log.getHealthLogId();
                    map.put("healthLogId", healthLogId);
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("oxygen", log.getOxygenSaturation());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> stressLevel = healthLogs.stream()
                .filter(log -> log.getStressLevel() != null)
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
                    Long healthLogId = log.getHealthLogId();
                    map.put("healthLogId", healthLogId);
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("level", log.getStressLevel());
                    return map;
                })
                .collect(Collectors.toList());

        

        // Final grouped map
        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        result.put("bloodPressure", bloodPressure);
        result.put("diabetes", diabetes);
        result.put("heartRate", heartRate);
        result.put("temperature", temperature);
        result.put("oxygenSaturation", oxygenSaturation);
        result.put("stressLevel", stressLevel);
        

        return result;
    }




}
