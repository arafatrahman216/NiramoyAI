package com.example.niramoy.repository;

import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.Visits;
import com.example.niramoy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitsRepository extends JpaRepository<Visits, Long> {
    
    // Find all visits by user
    List<Visits> findByUser(User user);
    
    // Find all visits by user ID
    List<Visits> findByUserId(Long userId);
    
    // Find visits by user and order by appointment date descending (most recent first)
    List<Visits> findByUserOrderByAppointmentDateDesc(User user);
    
    // Find visits by user ID and order by appointment date descending
    List<Visits> findByUserIdOrderByAppointmentDateDesc(Long userId);

    List<Visits> findByDoctorAndUser(Doctor doctor, User user);
    
    Optional<Visits> findByVisitId(Long visitId);
}
