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
public class MedicineResponseDTO {
    private Long medicineId;
    private String medicineName;
    private List<String> frequency;
    private String doses;
    private String duration;
}
