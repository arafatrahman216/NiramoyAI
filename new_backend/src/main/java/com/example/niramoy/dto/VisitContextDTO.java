package com.example.niramoy.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VisitContextDTO {
    private Long visitId;
    private String doctorName;
    private String appointmentDate;
    private String diagnosis;
    private List<String> symptoms;
    private List<String> prescription;
    private String summary;
    private Map<String, Object> otherInfo;
}


