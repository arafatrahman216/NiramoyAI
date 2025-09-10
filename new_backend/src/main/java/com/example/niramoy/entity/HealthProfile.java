package com.example.niramoy.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

// =========================
// HEALTH PROFILE ENTITY
// =========================
@Entity
@Table(name = "health_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthProfile {
    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JsonIgnore
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "gender")
    private String gender;

    @Column(name = "date_of_birth")
    private String dateOfBirth;

    @Column(name = "weight")
    private Double weight;

    @Column(name = "height")
    private Double height;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "blood_type")
    private String bloodType;

    @Column(name = "major_health_events")
    private String majorHealthEvents;

    @Column(name = "lifestyle", columnDefinition = "TEXT")
    private String lifestyle; // Store as JSON string or comma-separated values

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies; // Store as JSON string or comma-separated values

    @Column(name = "major_events", columnDefinition = "TEXT")
    private String majorEvents; // Store as JSON string or comma-separated values

    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases; // Store as JSON string or comma-separated values

    @Column(name = "calculated_age")
    private Integer calculatedAge;

    @Version
    private Long version;
}