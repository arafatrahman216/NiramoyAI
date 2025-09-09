package com.example.niramoy.repository;


import com.example.niramoy.entity.Doctor;
import com.example.niramoy.entity.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, Long> {


    // If the username is at: DoctorProfile -> Doctor -> User
    @Query("SELECT dp FROM DoctorProfile dp " +
            "JOIN dp.user u " +    // Join from that Doctor to its User
            "WHERE u.username = :username") // Filter by the User's username
    DoctorProfile findByUsername( String username);



}
