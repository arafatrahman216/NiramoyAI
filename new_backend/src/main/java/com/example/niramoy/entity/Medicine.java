package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


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
    @JoinColumn(name = "visit_id", nullable = false)
    private Visits visits;

    private String medicineName;
    private List<String> frequency= new ArrayList<>();
    private String doses;
    private String duration;
    private String instructions;
    private String type ; // tablet, capsule, injection, syrup
}
