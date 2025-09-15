package com.example.niramoy.utils;

import lombok.Builder;


@Builder
public record HealthLogRecord(
    String diastolicBloodPressure,
    String systolicBloodPressure,
    String weight,
    String heartRate,
    String stressLevel,
    String bloodSugar,
    String temperature,
    String oxygenSaturation
) {}