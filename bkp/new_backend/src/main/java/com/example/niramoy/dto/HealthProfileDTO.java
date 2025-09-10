package com.example.niramoy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HealthProfileDTO {
    private String gender;
    @JsonProperty("date_of_birth")
    private String dateOfBirth;
    private Double weight;
    private Double height;
    @JsonProperty("heart_rate")
    private Integer heartRate;
    @JsonProperty("blood_pressure")
    private String bloodPressure;
    @JsonProperty("blood_type")
    private String bloodType;
    @JsonProperty("major_health_events")
    private String majorHealthEvents;
    private List<String> lifestyle;
    private List<String> allergies;
    @JsonProperty("major_events")
    private List<String> majorEvents;
    @JsonProperty("chronic_diseases")
    private List<String> chronicDiseases;
    @JsonProperty("calculated_age")
    private Integer calculatedAge;
}
