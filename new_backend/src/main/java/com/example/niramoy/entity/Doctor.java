package com.example.niramoy.entity;

import com.example.niramoy.enumerate.DoctorSource;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;



    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DoctorSource source;

    @Column(nullable = false)
    private String degree;

    private String hospitalName;

    @Column(nullable = false)
    private String specialization;

    private Integer experience;

}
