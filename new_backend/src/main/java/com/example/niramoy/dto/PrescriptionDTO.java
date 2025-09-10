package com.example.niramoy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;



@Data
@AllArgsConstructor
public class PrescriptionDTO {
    private MultipartFile image;
    private String doctorName;
    private String symptoms;
    private String prescription;
    private String  appointmentDate;

}
