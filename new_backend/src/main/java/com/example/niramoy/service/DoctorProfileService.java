package com.example.niramoy.service;


import com.example.niramoy.dto.DoctorProfileDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.entity.User;
import com.example.niramoy.enumerate.DoctorSource;
import com.example.niramoy.error.DuplicateUserException;
import com.example.niramoy.repository.DoctorProfileRepository;
import com.example.niramoy.repository.DoctorRepository;
import com.example.niramoy.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class DoctorProfileService {

    private final DoctorRepository doctorRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;

    public DoctorProfile findDoctorByUsername(String username){
        return doctorProfileRepository.findByUsername(username);
    }

    @Transactional
    public DoctorProfile createDoctorProfile(Map<String, String> newDoctor, Doctor doctor, User user) {
        try{
            newDoctor = makeDoctorProfileNotNull(newDoctor);
            DoctorProfile doctorProfile = DoctorProfile.builder().doctor(doctor).user(user)
                    .medicalCollege((String) newDoctor.get("medicalCollege"))
                    .bmdcRegistrationNumber((String) newDoctor.get("BMDCNumber"))
                    .consultationFee(0.00).isVerified(true).isAvailable(true)
                    .about((String) newDoctor.get("about")).supportingDocumentsUrl((String) newDoctor.get("supportingDocumentsUrl"))
                    .build();
            System.out.println("hi3");
            doctorProfileRepository.save(doctorProfile);
            System.out.println("hi4");
            return doctorProfile;
        }
        catch (DuplicateUserException e){
            throw new DuplicateUserException("User already exists");
        }
        
    }


    @Transactional
    public Doctor createDoctor(Map<String, String> doctorMap){
        String name = (String) doctorMap.get("name");
        DoctorSource dc = DoctorSource.REGISTERED;
        String degree = (String) doctorMap.get("degree");
        String specialization = (String) doctorMap.get("specialization");
        String hospitalName = (String) doctorMap.get("hospitalName");
        Integer experience = Integer.parseInt((String) doctorMap.get("experience") == null ? "0" : (String) doctorMap.get("experience"));


        Doctor doctor = Doctor.builder().name(name).source(dc).specialization(specialization)
                .hospitalName(hospitalName).experience(experience).degree(degree)
                .build();
        doctorRepository.save(doctor);
        return doctor;
    }

    private Map<String,String> makeDoctorProfileNotNull(Map<String, String> doctorMap){
        ArrayList<String> keys = new ArrayList<>(  );
        keys.add("name"); keys.add("degree"); keys.add("specialization"); keys.add("hospitalName");  keys.add("medicalCollege"); keys.add("BMDCNumber"); keys.add("supportingDocumentsUrl");  keys.add("about");
        for (String key : keys){
            if (doctorMap.get(key) == null){
                doctorMap.put(key, "");
            }
        }
        if (doctorMap.get("experience") == null){
            doctorMap.put("experience", "0");
        }
        if (doctorMap.get("consultationFee") == null){
            doctorMap.put("consultationFee", "0");
        }
        return doctorMap;


    }


    public DoctorProfileDTO getDoctorProfile(User user) {
        DoctorProfile doctorProfile = doctorProfileRepository.findByUsername(user.getUsername());
        if (doctorProfile == null) {
            throw new RuntimeException("Doctor profile not found for user id: " + user.getId());
        }
        Doctor doctor = doctorProfile.getDoctor();
        return DoctorProfileDTO.builder()
                .name(doctor.getName())
                .phoneNumber(user.getPhoneNumber())
                .email(user.getEmail()).consultationFee(doctorProfile.getConsultationFee())
                .hospitalName(doctor.getHospitalName()).isAvailable(doctorProfile.getIsAvailable())
                .experience(doctor.getExperience().toString()).degree(doctor.getDegree())
                .specialization(doctor.getSpecialization()).isVerified(doctorProfile.getIsVerified()).build();
    }

    public void updateProfile(User user, Map<String, Object> updates) {
        DoctorProfile doctorProfile = doctorProfileRepository.findByUsername(user.getUsername());
        if (doctorProfile == null) {
            throw new RuntimeException("Doctor profile not found for user id: " + user.getId());
        }
        if (updates.containsKey("consultationFee")) {
            doctorProfile.setConsultationFee((double) Double.parseDouble((String) updates.get("consultationFee")));
        }
        if (updates.containsKey("isAvailable")) {
            doctorProfile.setIsAvailable((boolean) updates.get("isAvailable"));
        }
        doctorProfileRepository.save(doctorProfile);
        userRepository.save(user);
        System.out.println("hi after update");

    }
}
