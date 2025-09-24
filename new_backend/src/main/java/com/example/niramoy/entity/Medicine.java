package com.example.niramoy.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

//    @ManyToOne
//    @JoinColumn(name = "prescription_id", nullable = false)
//    private Prescription prescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "visit_id", nullable = true)
    @JsonIgnore
    private Visits visit;

    private String medicineName;
    private List<String> frequency= new ArrayList<>();
    private String doses;
    private String duration;
    private String instructions;
    private String type ; // tablet, capsule, injection, syrup
    @Column(name = "taking",nullable = true)
    private boolean taking = true ;
}
