package com.example.NiramoyAI.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonProperty;



@AllArgsConstructor     
@NoArgsConstructor
@Data   
public class HealthRecordDTO {

    @JsonProperty("gender")
    private String gender;

    @JsonProperty("date_of_birth")
    private String dateOfBirth;
    
    @JsonProperty("weight")
    private String weight;

    @JsonProperty("height")
    private String height;

    @JsonProperty("heart_rate")
    private String heartRate;

    @JsonProperty("blood_pressure")
    private String bloodPressure;

    @JsonProperty("blood_type")
    private String bloodType;

    @JsonProperty("major_health_events")
    private String majorHealthEvents;

    @JsonProperty("lifestyle")
    private List<String> lifestyle;
    
    @JsonProperty("allergies")
    private List<String> allergies;

    @JsonProperty("major_health_events")
    private List<String> majorEvents;

    @JsonProperty("chronic_diseases")
    private List<String> chronicDiseases;

    @JsonProperty("calculatedAge")
    private int calculatedAge;
}

