package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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
    private Long visitId;

    private LocalDateTime visitDatetime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @OneToOne
    @JoinColumn(name = "prescription_id")
    private Prescription prescriptionId;

    private String visitType; // new, follow-up, report

    private String recommendations;
    private String symptoms;

    @OneToOne(mappedBy = "visits")
    private Prescription prescription;
}
