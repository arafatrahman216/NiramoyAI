package com.example.NiramoyAI.controller;

import com.example.NiramoyAI.model.*;
import com.example.NiramoyAI.repository.RoleRepository;
import com.example.NiramoyAI.repository.UserRepository;
import com.example.NiramoyAI.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepo;
    
    @Autowired
    private RoleRepository roleRepo;
    
    @Autowired
    private UserRoleRepository userRoleRepo;

    // Get all users (Admin only)
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<User> users = userRepo.findAll();
        Map<String, Object> response = new HashMap<>();
        
        List<Map<String, Object>> userResponses = users.stream()
                .map(user -> {
                    List<String> roles = userRoleRepo.findByUserId(user.getId())
                            .stream()
                            .map(ur -> ur.getRole().getName().toString())
                            .collect(Collectors.toList());
                    return createUserResponse(user, roles);
                })
                .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("users", userResponses);
        response.put("total", users.size());
        return ResponseEntity.ok(response);
    }

    // Get user by ID
    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userRepo.findById(id);
        Map<String, Object> response = new HashMap<>();
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            List<String> roles = userRoleRepo.findByUserId(user.getId())
                    .stream()
                    .map(ur -> ur.getRole().getName().toString())
                    .collect(Collectors.toList());
            
            response.put("success", true);
            response.put("user", createUserResponse(user, roles));
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.notFound().build();
    }

    // Delete user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            response.put("success", true);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        }
        
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.notFound().build();
    }

    // Update user status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<Map<String, Object>> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newStatus = request.get("status");
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            try {
                user.setStatus(UserStatus.valueOf(newStatus));
                userRepo.save(user);
                
                response.put("success", true);
                response.put("message", "User status updated successfully");
                response.put("username", user.getUsername());
                response.put("newStatus", newStatus);
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                response.put("success", false);
                response.put("message", "Invalid status. Valid values: ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION");
                return ResponseEntity.badRequest().body(response);
            }
        }
        
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.notFound().build();
    }
    
    // Add role to user
    @PostMapping("/users/{id}/roles")
    public ResponseEntity<Map<String, Object>> addRoleToUser(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String roleName = request.get("roleName");
        Map<String, Object> response = new HashMap<>();
        
        Optional<User> userOpt = userRepo.findById(id);
        if (userOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "User not found");
            return ResponseEntity.notFound().build();
        }
        
        try {
            RoleName roleNameEnum = RoleName.valueOf(roleName);
            Optional<Role> roleOpt = roleRepo.findByName(roleNameEnum);
            
            if (roleOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Role not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            User user = userOpt.get();
            Role role = roleOpt.get();
            
            // Check if user already has this role
            List<UserRole> existingRoles = userRoleRepo.findByUserId(user.getId());
            boolean hasRole = existingRoles.stream()
                    .anyMatch(ur -> ur.getRole().getName().equals(roleNameEnum));
            
            if (hasRole) {
                response.put("success", false);
                response.put("message", "User already has this role");
                return ResponseEntity.badRequest().body(response);
            }
            
            UserRole userRole = new UserRole(user, role);
            userRoleRepo.save(userRole);
            
            response.put("success", true);
            response.put("message", "Role added to user successfully");
            response.put("username", user.getUsername());
            response.put("roleName", roleName);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", "Invalid role name. Valid values: ROLE_USER, ROLE_ADMIN, ROLE_SUPER_ADMIN");
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Get user statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalUsers = userRepo.count();
        
        long adminCount = userRoleRepo.findByRoleName(RoleName.ROLE_ADMIN).size();
        long superAdminCount = userRoleRepo.findByRoleName(RoleName.ROLE_SUPER_ADMIN).size();
        long userCount = userRoleRepo.findByRoleName(RoleName.ROLE_USER).size();
        
        stats.put("success", true);
        stats.put("totalUsers", totalUsers);
        stats.put("adminCount", adminCount);
        stats.put("superAdminCount", superAdminCount);
        stats.put("userCount", userCount);
        
        return ResponseEntity.ok(stats);
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
