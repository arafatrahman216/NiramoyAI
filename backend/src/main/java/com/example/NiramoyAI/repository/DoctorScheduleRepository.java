package com.example.NiramoyAI.repository;

import com.example.NiramoyAI.model.Doctor;
import com.example.NiramoyAI.model.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    
    List<DoctorSchedule> findByDoctor(Doctor doctor);
    
    List<DoctorSchedule> findByDoctorAndIsAvailable(Doctor doctor, Boolean isAvailable);
    
    List<DoctorSchedule> findByDoctorAndDayOfWeek(Doctor doctor, DoctorSchedule.DayOfWeek dayOfWeek);
    
    @Query("SELECT ds FROM DoctorSchedule ds WHERE ds.doctor = :doctor AND ds.dayOfWeek = :dayOfWeek AND ds.isAvailable = true")
    List<DoctorSchedule> findAvailableSchedulesByDoctorAndDay(@Param("doctor") Doctor doctor, @Param("dayOfWeek") DoctorSchedule.DayOfWeek dayOfWeek);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM DoctorSchedule ds WHERE ds.doctor = :doctor")
    void deleteByDoctor(@Param("doctor") Doctor doctor);
}
