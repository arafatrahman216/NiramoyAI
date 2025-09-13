package com.example.niramoy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VisitResponseDTO {
    private Long visitId;
    private LocalDate appointmentDate;
    private String doctorName;
    private String symptoms;
    private String prescription;
    private String prescriptionFileUrl;
    private List<String> testReportUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Optional: include user ID if needed without full user object
    private Long userId;
}
