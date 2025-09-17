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

    @Column(name = "test_name")
    private String testName;

    @Column(name = "test_datetime")
    private java.time.LocalDateTime testDatetime;


    @ElementCollection
    @CollectionTable(name = "test_image_urls", joinColumns = @JoinColumn(name = "given_test_id"))
    @Column(name = "image_link")
    private java.util.List<String> imageLinks;

    private String summary;

}
