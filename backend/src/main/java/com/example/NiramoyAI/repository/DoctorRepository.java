package com.example.NiramoyAI.repository;

import com.example.NiramoyAI.model.Doctor;
import com.example.NiramoyAI.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    Optional<Doctor> findByUser(User user);
    
    Optional<Doctor> findByLicenseNumber(String licenseNumber);
    
    List<Doctor> findByIsAvailableTrue();
    
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    
    @Query("SELECT d FROM Doctor d WHERE d.isAvailable = true AND " +
           "(LOWER(d.user.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.user.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.hospitalAffiliation) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Doctor> searchDoctors(@Param("query") String query);
    
    @Query("SELECT d FROM Doctor d WHERE d.isAvailable = true ORDER BY d.rating DESC")
    List<Doctor> findTopRatedDoctors();
    
    @Query("SELECT DISTINCT d.specialization FROM Doctor d WHERE d.isAvailable = true ORDER BY d.specialization")
    List<String> findAllSpecializations();
}
