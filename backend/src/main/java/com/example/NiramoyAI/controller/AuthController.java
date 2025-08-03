package com.example.NiramoyAI.controller;

import com.example.NiramoyAI.model.*;
import com.example.NiramoyAI.repository.RoleRepository;
import com.example.NiramoyAI.repository.UserRepository;
import com.example.NiramoyAI.repository.UserRoleRepository;
import com.example.NiramoyAI.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private RoleRepository roleRepo;
    
    @Autowired
    private UserRoleRepository userRoleRepo;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String phoneNumber = request.get("phoneNumber");
        
        Map<String, Object> response = new HashMap<>();
        
        // Validation
        if (username == null || email == null || password == null || firstName == null || lastName == null) {
            response.put("success", false);
            response.put("message", "All required fields must be provided: username, email, password, firstName, lastName");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if username already exists
        if (userRepo.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if email already exists
        if (userRepo.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Create new user
        User user = new User(username, email, passwordEncoder.encode(password), firstName, lastName);
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            user.setPhoneNumber(phoneNumber);
        }
        User savedUser = userRepo.save(user);
        
        // Assign USER role
        Optional<Role> userRoleOpt = roleRepo.findByName(RoleName.ROLE_USER);
        if (userRoleOpt.isPresent()) {
            UserRole userRole = new UserRole(savedUser, userRoleOpt.get());
            userRoleRepo.save(userRole);
        }
        
        // Get user roles for token generation
        List<String> roles = List.of("ROLE_USER");
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getUsername(), savedUser.getId(), roles);
        
        response.put("success", true);
        response.put("message", "User registered successfully");
        response.put("token", token);
        response.put("user", createUserResponse(savedUser, roles));
        return ResponseEntity.ok(response);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String usernameOrEmail = request.get("username");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        if (usernameOrEmail == null || password == null) {
            response.put("success", false);
            response.put("message", "Username/email and password are required");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Find user by username or email
        Optional<User> userOpt = userRepo.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepo.findByEmail(usernameOrEmail);
        }
        
        if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
            User user = userOpt.get();
            
            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepo.save(user);
            
            // Get user roles
            List<String> roles = userRoleRepo.findByUserId(user.getId())
                    .stream()
                    .map(ur -> ur.getRole().getName().toString())
                    .collect(Collectors.toList());
            
            // Generate JWT token
            String token = jwtUtil.generateToken(user.getUsername(), user.getId(), roles);
            
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", createUserResponse(user, roles));
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "Invalid username/email or password");
        return ResponseEntity.badRequest().body(response);
    }

    // Admin Registration
    @PostMapping("/admin/register")
    public ResponseEntity<Map<String, Object>> registerAdmin(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String phoneNumber = request.get("phoneNumber");
        String adminKey = request.get("adminKey");
        
        Map<String, Object> response = new HashMap<>();
        
        // Simple admin key check (you can make this more secure)
        if (!"admin123".equals(adminKey)) {
            response.put("success", false);
            response.put("message", "Invalid admin key");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Validation
        if (username == null || email == null || password == null || firstName == null || lastName == null) {
            response.put("success", false);
            response.put("message", "All required fields must be provided: username, email, password, firstName, lastName");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if username already exists
        if (userRepo.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Check if email already exists
        if (userRepo.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        // Create new admin user
        User admin = new User(username, email, passwordEncoder.encode(password), firstName, lastName);
        if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
            admin.setPhoneNumber(phoneNumber);
        }
        User savedAdmin = userRepo.save(admin);
        
        // Assign ADMIN role
        Optional<Role> adminRoleOpt = roleRepo.findByName(RoleName.ROLE_ADMIN);
        if (adminRoleOpt.isPresent()) {
            UserRole userRole = new UserRole(savedAdmin, adminRoleOpt.get());
            userRoleRepo.save(userRole);
        }
        
        // Get admin roles for token generation
        List<String> roles = List.of("ROLE_ADMIN");
        
        // Generate JWT token
        String token = jwtUtil.generateToken(savedAdmin.getUsername(), savedAdmin.getId(), roles);
        
        response.put("success", true);
        response.put("message", "Admin registered successfully");
        response.put("token", token);
        response.put("user", createUserResponse(savedAdmin, roles));
        return ResponseEntity.ok(response);
    }
    
    // Doctor Registration
    @PostMapping("/doctor/register")
    public ResponseEntity<Map<String, Object>> registerDoctor(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String phoneNumber = request.get("phoneNumber");
        
        Map<String, Object> response = new HashMap<>();
        
        // Check if username or email already exists
        if (userRepo.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        if (userRepo.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "Email already exists");
            return ResponseEntity.badRequest().body(response);
        }
        
        try {
            // Create doctor user
            User doctor = new User();
            doctor.setUsername(username);
            doctor.setEmail(email);
            doctor.setPassword(passwordEncoder.encode(password));
            doctor.setFirstName(firstName);
            doctor.setLastName(lastName);
            doctor.setPhoneNumber(phoneNumber);
            doctor.setStatus(UserStatus.ACTIVE);
            doctor.setCreatedAt(LocalDateTime.now());
            doctor.setUpdatedAt(LocalDateTime.now());
            
            User savedDoctor = userRepo.save(doctor);
            
            // Assign DOCTOR role
            Role doctorRole = roleRepo.findByName(RoleName.ROLE_DOCTOR)
                .orElseThrow(() -> new RuntimeException("Doctor role not found"));
            
            UserRole userRole = new UserRole(savedDoctor, doctorRole);
            userRoleRepo.save(userRole);
            
            // Get doctor roles for token generation
            List<String> roles = List.of("ROLE_DOCTOR");
            
            // Generate JWT token
            String token = jwtUtil.generateToken(savedDoctor.getUsername(), savedDoctor.getId(), roles);
            
            response.put("success", true);
            response.put("message", "Doctor registered successfully");
            response.put("token", token);
            response.put("user", createUserResponse(savedDoctor, roles));
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // Helper method to create user response
    private Map<String, Object> createUserResponse(User user, List<String> roles) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("firstName", user.getFirstName());
        userResponse.put("lastName", user.getLastName());
        userResponse.put("phoneNumber", user.getPhoneNumber());
        userResponse.put("status", user.getStatus().toString());
        userResponse.put("roles", roles);
        userResponse.put("createdAt", user.getCreatedAt());
        userResponse.put("lastLogin", user.getLastLogin());
        return userResponse;
    }
}
