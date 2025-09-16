package com.example.niramoy.dto;

import com.google.auto.value.AutoValue.Builder;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class VisitDTO {
    private Long visitId ;
    private String appointmentDate;
    private String doctorName;
    private String patientName ;
    private Long userId;
    private Long doctorId ;
    private String symptoms ;
    private String prescription ;
    private String prescriptionFileUrl ;

}
