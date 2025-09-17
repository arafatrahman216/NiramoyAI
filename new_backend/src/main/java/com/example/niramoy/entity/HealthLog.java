package com.example.niramoy.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "health_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"user"})
public class HealthLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long healthLogId;

    @ManyToOne
    @JsonIgnore
    @JsonBackReference
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

    @OneToOne(mappedBy = "healthLog", fetch = FetchType.LAZY)
    @JsonIgnore
    private Visits visit;

    @Column(name = "stress_level")
    private Integer stressLevel;

    @Column(name = "heart_rate")
    private Integer heartRate;

    @Column(name = "oxygen_saturation")
    private Double oxygenSaturation;

    @Column(name = "other_symptoms" , columnDefinition = "text[]")
    private List<String> otherSymptoms= new ArrayList<>();

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "weight")
    private Double weight;
}
