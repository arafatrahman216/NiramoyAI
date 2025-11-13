package com.example.niramoy.repository;

import com.example.niramoy.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor,Long> {

    @Modifying
    @Query("INSERT INTO Doctor (name, specialization, source, degree, experience,hospitalName) " +
            "VALUES (:#{#doctor.name}, :#{#doctor.specialization}, :#{#doctor.source}, " +
            ":#{#doctor.degree}, :#{#doctor.experience} , :#{#doctor.hospitalName})")
    Doctor createNewDoctor(@Param("d") Doctor d);

    Optional<Doctor> findByDoctorId(Long doctorId);

}
