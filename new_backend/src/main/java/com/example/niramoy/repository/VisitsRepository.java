package com.example.niramoy.repository;

import com.example.niramoy.entity.Visits;
import com.example.niramoy.entity.User;
import dev.langchain4j.service.V;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitsRepository extends JpaRepository<Visits, Long> {
    
    // Find all visits by user
    List<Visits> findByUser(User user);

    List<Visits> findByUserAndDoctor_DoctorId(User user, Long doctorDoctorId);

    // Find all visits by user ID
    List<Visits> findByUserId(Long userId);
    
    // Find visits by user and order by appointment date descending (most recent first)
    List<Visits> findByUserOrderByAppointmentDateDesc(User user);
    
    // Find visits by user ID and order by appointment date descending
    List<Visits> findByUserIdOrderByAppointmentDateDesc(Long userId);

    // Find visits by doctor ID and order by appointment date descending
    List<Visits> findByDoctor_DoctorIdOrderByAppointmentDateDesc(Long doctorId);
}
