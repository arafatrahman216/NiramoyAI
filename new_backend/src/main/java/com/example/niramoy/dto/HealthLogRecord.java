package com.example.niramoy.dto;

import lombok.Builder;

import java.util.List;


@Builder
public record HealthLogRecord(
    String diastolicBloodPressure,
    String systolicBloodPressure,
    String weight,
    String heartRate,
    String stressLevel,
    String bloodSugar,
    String temperature,
    String oxygenSaturation,
    String note,
    List<String> otherSymptoms

) {}