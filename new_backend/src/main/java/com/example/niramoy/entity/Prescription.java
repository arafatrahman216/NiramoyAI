package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Table(name = "prescriptions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long prescriptionId;

    @OneToOne
    @JoinColumn(name = "visit_id")
    private Visits visits;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    private String diagnosis;
    private String symptoms;

//    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Medicine> medicines;

//    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<GivenTests> givenTests;
}
