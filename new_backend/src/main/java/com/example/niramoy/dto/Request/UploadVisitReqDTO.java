package com.example.niramoy.dto.Request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadVisitReqDTO {
    private String appointmentDate;
    private String doctorName;
    private String symptoms;
    private String prescription;
    private MultipartFile prescriptionFile;
    // private List<MultipartFile> testReports;
}
