package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long healthLogId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Column(name = "blood_sugar", length = 20)
    private Double bloodSugar;

    @Column(name = "log_datetime", nullable = false)
    private LocalDateTime logDatetime;

    @Column(name = "temperature", length = 20)
    private Double temperature;

    @Column(name = "stress_level")
    private Integer stressLevel;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "oxygen_saturation")
    private Double oxygenSaturation;

    @Column(name = "other_symptoms")
    private String otherSymptoms;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "weight")
    private Double weight;
}
