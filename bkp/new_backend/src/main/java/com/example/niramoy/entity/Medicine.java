package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "medicines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long medicineId;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    private String medicineName;
    private String frequency;
    private String doses;
    private String duration;
    private String instructions;
}
