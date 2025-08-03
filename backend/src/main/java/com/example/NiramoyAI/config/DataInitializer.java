package com.example.NiramoyAI.config;

import com.example.NiramoyAI.model.Role;
import com.example.NiramoyAI.model.RoleName;
import com.example.NiramoyAI.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepo;

    @Override
    public void run(String... args) throws Exception {
        // Create default roles if they don't exist
        for (RoleName roleName : RoleName.values()) {
            if (roleRepo.findByName(roleName).isEmpty()) {
                Role role = new Role(roleName);
                roleRepo.save(role);
                System.out.println("Created role: " + roleName);
            }
        }
    }
}
