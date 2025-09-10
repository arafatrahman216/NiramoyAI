package com.example.niramoy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tests {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    private String name;
    private String category;
    private Double cost;
    private String duration;
    private String instruction;
    private String description;
    private String hospital;

    @OneToMany(mappedBy = "test")
    private java.util.List<GivenTests> givenTests;
}
