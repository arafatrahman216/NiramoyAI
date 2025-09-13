package com.example.niramoy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionResponseDTO {
    private Long prescriptionId;
    private String imageUrl;
    private String diagnosis;
    private String symptoms;
    private List<MedicineResponseDTO> medicines;
    
    // Reference to visit without full visit object
    private Long visitId;
}
