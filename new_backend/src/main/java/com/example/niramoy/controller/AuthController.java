package com.example.niramoy.controller;


import com.example.niramoy.dto.LoginRequestDTO;
import com.example.niramoy.dto.LoginResponseDTO;
import com.example.niramoy.dto.UserDTO;
import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.DoctorProfile;
import com.example.niramoy.entity.User;
import com.example.niramoy.repository.DoctorRepository;
import com.example.niramoy.repository.UserRepository;
import com.example.niramoy.service.AuthService;
import com.example.niramoy.service.DoctorProfileService;
import com.example.niramoy.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final DoctorProfileService doctorProfileService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login( @RequestBody LoginRequestDTO loginRequestDTO){

        return ResponseEntity.ok(authService.login(loginRequestDTO));
    }


    @PostMapping("/signup")
    public ResponseEntity<HashMap<String,Object>> signup(@RequestBody Map<String, String> user){
        HashMap<String, Object> response = new HashMap<>();
        try {
            User newUser = authService.signup(user);
            if (newUser != null) {
                response.put("success", true);
                response.put("message", "Account created successfully. Please login.");
            } else {
                response.put("success", false);
                response.put("message", "Registration failed");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/doctor/signup")
    public ResponseEntity<HashMap<String,Object>> doctorSignup(@RequestBody Map<String, String> doctorMap){
        HashMap<String, Object> response =new HashMap<>();
        if (doctorMap.containsKey("role")){
            doctorMap.put("role", "DOCTOR");
        }
        System.out.println(doctorMap);
        User user = authService.signup(doctorMap);
        Doctor doctor = doctorProfileService.createDoctor(doctorMap);
        DoctorProfile doctorProfile = doctorProfileService.createDoctorProfile(doctorMap, doctor, user);
        if (user!=null) response.put("success", true);
        else response.put("success", false);
//        response.put("userDTO", userDTO);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/test")
    public ResponseEntity<HashMap<String, Object>> test(@RequestBody Map<String, String> doctorMap){
        HashMap<String, Object> response = new HashMap<>();
        Long id= Integer.toUnsignedLong(18);
        Optional<User> user = userRepository.findById(id);
        Optional<Doctor> doctor = doctorRepository.findByDoctorId(Integer.toUnsignedLong(5));
        System.out.println(doctor.get());

        System.out.println(user.get());
        response.put("user", user.get());
        response.put("doctor", doctor.get());
        System.out.println("hi1");
        DoctorProfile doctorProfile = doctorProfileService.createDoctorProfile(doctorMap, doctor.get(), user.get());
        System.out.println("hi2");
        System.out.println(doctorProfile);
        response.put("doctorProfile", doctorProfile);
        return ResponseEntity.ok(response);
    }

}
