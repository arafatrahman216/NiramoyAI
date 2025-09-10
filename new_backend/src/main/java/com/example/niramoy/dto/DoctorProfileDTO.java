package com.example.niramoy.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorProfileDTO {

    private String name;
    private String phoneNumber;
    private String email;
    private String specialization;
    private String gender;
    private String profilePictureUrl;
    private String degree;
    double consultationFee;
    private String about;
    private boolean isVerified;
    private boolean isAvailable;
    private String experience;
    private String image;
    private String description;
    private String address;
    private String hospitalName;
    private String rating;

    public DoctorProfileDTO(String phoneNumber, String specialization, String degree, double consultationFee, String about, boolean isAvailable, String experience, String hospitalName) {
        this.phoneNumber = phoneNumber;
        this.specialization = specialization;
        this.degree = degree;
        this.consultationFee = consultationFee;
        this.about = about;
        this.isAvailable = isAvailable;
        this.experience = experience;
        this.hospitalName = hospitalName;
    }
}
