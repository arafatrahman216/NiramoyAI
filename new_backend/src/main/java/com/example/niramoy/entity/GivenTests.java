package com.example.niramoy.entity;


import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.List;

@Entity
@Table(name = "given_tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GivenTests {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long givenTestId;

    @ManyToOne
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    // direct reference to master Test table
    @ManyToOne
    @JoinColumn(name = "test_ref_id")
    private Tests test;

    private java.time.LocalDateTime testDatetime;
    private String report;

    @ElementCollection
    @CollectionTable(name = "test_image_urls", joinColumns = @JoinColumn(name = "given_test_id"))
    @Column(name = "image_link")
    private java.util.List<String> imageLinks;

    private String summary;
    private String urgency;
}
