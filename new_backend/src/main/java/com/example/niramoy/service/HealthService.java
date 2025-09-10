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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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


    public Map<String, List<Map<String, Object>>> transformToVitals(List<HealthLog> healthLogs) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Blood Pressure
        List<Map<String, Object>> bloodPressure = healthLogs.stream()
                .filter(log -> log.getBloodPressure() != null)
                .map(log -> {
                    String[] parts = log.getBloodPressure().split("/");
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("systolic", parseInt(parts[0]));
                    map.put("diastolic", parseInt(parts[1]));
                    return map;
                })
                .collect(Collectors.toList());

        // Diabetes (Blood Sugar)
        List<Map<String, Object>> diabetes = healthLogs.stream()
                .filter(log -> log.getBloodSugar() != null)
                .map(log -> {
                    Map<String, Object> map = new HashMap<>();
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
                    map.put("date", log.getLogDatetime().format(formatter));
                    map.put("bpm", log.getHeartRate());
                    return map;
                })
                .collect(Collectors.toList());

        // Final grouped map
        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        result.put("bloodPressure", bloodPressure);
        result.put("diabetes", diabetes);
        result.put("heartRate", heartRate);

        return result;
    }

    @Transactional
    public boolean addNewHealthLog( User user ,Map<String, Object> formData) {
        try{
            System.out.println(formData);
            String systolic = (String) formData.get("blood_pressure_systolic") ;
            systolic = systolic==null?"120":systolic;
            String diastolic = (String) formData.get("blood_pressure_diastolic");
            diastolic = diastolic==null?"80":diastolic;
            System.out.println(diastolic);
            Integer heartRate = Integer.parseInt((String) formData.get("heart_rate"));
            if (heartRate == null) heartRate = 0;
            Double bloodSugar = Double.parseDouble((String) formData.get("blood_sugar"));
            System.out.println(bloodSugar);
            if (bloodSugar==null) bloodSugar=7.0;
            String logDatetime = "";

            String logDate = (String) formData.get("log_date");
            String logTime = (String) formData.get("log_time");
            if (logDate != null && logTime != null) {
                logDatetime = logDate + "T" + logTime + ":00";
            }
            Double oxygenSaturation = Double.parseDouble((String) formData.get("oxygen_saturation"));
            if (oxygenSaturation == null) oxygenSaturation = 100.0;
            Integer stressLevel = Integer.parseInt((String) formData.get("stress_level"));
            if (stressLevel == null) stressLevel = 0;
            Double weight = Double.parseDouble((String) formData.get("weight"));
            if (weight == null) weight = 0.0;
            String note = (String) formData.get("notes");
            if (note == null) note = "";
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
                    .weight(weight)
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


}
