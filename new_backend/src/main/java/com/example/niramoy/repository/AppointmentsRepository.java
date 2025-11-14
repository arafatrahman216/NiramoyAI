package com.example.niramoy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.niramoy.entity.Appointments;

import java.util.List;

public interface AppointmentsRepository extends JpaRepository<Appointments, Long> {
    @Query("SELECT a FROM Appointments a WHERE a.doctor.id = :doctorId")
    List<Appointments> findByDoctorId(Long doctorId);

    
}
