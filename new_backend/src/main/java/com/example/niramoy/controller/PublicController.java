package com.example.niramoy.controller;


import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.service.DoctorProfileService;
import com.example.niramoy.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class PublicController {

    private final DoctorProfileService doctorProfileService;
    private  final SearchService searchService;


    @GetMapping("/doctors")
    public ResponseEntity<DoctorProfile>

    getDoctorsByUsername(){

        return ResponseEntity.status(200).body(doctorProfileService.findDoctorByUsername("hasib"));
    }


    @GetMapping("/test")
    public String testEndpoint(){
        return searchService.getDoctors("Find the best test center for biopsy in Chittagong");
    }

}
