package com.example.niramoy.repository;

import com.example.niramoy.entity.Permissions;
import com.example.niramoy.entity.User;
import com.example.niramoy.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionsRepository extends JpaRepository<Permissions, Long> {
    
    // Find all permissions for a specific user
    List<Permissions> findByUser(User user);
    
    // Find all permissions for a specific doctor
    List<Permissions> findByDoctor(Doctor doctor);
    
    // Find a specific permission record by user and doctor
    Optional<Permissions> findByUserAndDoctor(User user, Doctor doctor);

    @Query("SELECT DISTINCT p.user FROM Permissions p WHERE p.doctor = :doc and p.permission = true "+
    "union "+
    "SELECT DISTINCT v.user FROM Visits v WHERE v.doctor = :doc")
    List<User> findDistinctUserByDoctor(Doctor doc);
}
