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
    @JoinColumn(name = "user_id")
    @JsonIgnore
    @JsonBackReference
    private User user;

    @Column(name = "height" )
    private String height;

    @Column(name = "weight" )
    private String weight;

    @Column(name = "blood_group" )
    private String bloodGroup;

    @Column(name = "allergies" )
    private String allergies;

    @Column(name = "surgeries" )
    private Integer heartRate;

    @Column(name = "blood_pressure")
    private String surgeries;

    @Column(name = "emergency_contact_number" )
    private String emergencyContactNumber;

    @Column(name = "major_health_events")
    private String majorHealthEvents;

    @Column(name = "emergency_contact_name" )
    private String emergencyContactName;

    @Column(name = "ongoing_medication" )
    private String ongoingMedication;

    @Column(name = "major_events", columnDefinition = "TEXT")
    private String majorEvents; // Store as JSON string or comma-separated values

    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases; // Store as JSON string or comma-separated values

    @Column(name = "calculated_age")
    private Integer calculatedAge;

    @Version
    private Long version;
}