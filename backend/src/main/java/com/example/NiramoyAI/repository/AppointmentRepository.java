package com.example.NiramoyAI.repository;

import com.example.NiramoyAI.model.Appointment;
import com.example.NiramoyAI.model.Doctor;
import com.example.NiramoyAI.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatient(User patient);
    
    List<Appointment> findByDoctor(Doctor doctor);
    
    List<Appointment> findByDoctorAndAppointmentDate(Doctor doctor, LocalDate date);
    
    List<Appointment> findByPatientAndStatus(User patient, Appointment.AppointmentStatus status);
    
    List<Appointment> findByDoctorAndStatus(Doctor doctor, Appointment.AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate = :date AND a.appointmentTime = :time AND a.status != 'CANCELLED'")
    List<Appointment> findConflictingAppointments(@Param("doctor") Doctor doctor, 
                                                 @Param("date") LocalDate date, 
                                                 @Param("time") LocalTime time);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor = :doctor AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findByDoctorAndDateRange(@Param("doctor") Doctor doctor, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.patient = :patient AND a.appointmentDate >= :startDate AND a.appointmentDate <= :endDate ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findByPatientAndDateRange(@Param("patient") User patient, 
                                               @Param("startDate") LocalDate startDate, 
                                               @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor = :doctor AND a.status = 'COMPLETED'")
    Long countCompletedAppointmentsByDoctor(@Param("doctor") Doctor doctor);
}
