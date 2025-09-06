package com.example.niramoy.entity;

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
    private User user;

    @Column(name = "height" )
    private Double height;

    @Column(name = "weight" )
    private Double weight;

    @Column(name = "blood_group" )
    private String bloodGroup;

    @Column(name = "allergies" )
    private String allergies;

    @Column(name = "surgeries" )
    private String surgeries;

    @Column(name = "emergency_contact_number" )
    private String emergencyContactNumber;

    @Column(name = "emergency_contact_name" )
    private String emergencyContactName;

    @Column(name = "ongoing_medication" )
    private String ongoingMedication;
}
