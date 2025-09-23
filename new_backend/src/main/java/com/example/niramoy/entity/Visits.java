package com.example.niramoy.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

// =========================
// VISIT ENTITY
// =========================
@Entity
@Table(name = "visits")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visits {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_id")
    private Long visitId;

    @Column(name = "appointment_date")
    private LocalDate appointmentDate;
    
    @Column(name = "doctor_name")
    private String doctorName;
    
    // Add doctor_id to satisfy database constraint (nullable for now since we only have doctor name)
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = true)
    private Doctor doctor;
    
    @Column(name = "symptoms")
    private String symptoms;

    @Column(name = "prescription")
    private String prescription;
    
    // Store file URLs instead of MultipartFile (since files are uploaded to bucket)
    @Column(name = "prescription_file_url")
    private String prescriptionFileUrl;
    
    @ElementCollection
    @CollectionTable(name = "visit_test_reports", joinColumns = @JoinColumn(name = "visit_id"))
    @Column(name = "test_report_url")
    private List<String> testReportUrls;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER, optional = true)
    @JoinColumn(name = "health_log_id", unique = true)  // FK column in visit table
    private HealthLog healthLog;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Medicine> medicines;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
