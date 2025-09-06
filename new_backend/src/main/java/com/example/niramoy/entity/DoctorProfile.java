package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorProfile {
    @Id
    private Long doctorId;

    @OneToOne
    @MapsId // doctorId is both PK and FK
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Back reference to User

    @Column(nullable = false)
    private Double consultationFee;

    private String about;

    @Column(nullable = false)
    private String gender;

    private String medicalCollege;

    private String profilePictureUrl;

    private String supportingDocumentsUrl;

    @Column(unique = true)
    private String bmdcRegistrationNumber;

    private Boolean isAvailable;

    private Boolean isVerified;

}
