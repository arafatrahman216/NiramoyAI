package com.example.niramoy.repository;


import com.example.niramoy.entity.Prescription;
import com.example.niramoy.entity.Visits;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {



    Optional<Prescription> findByVisits(Visits visits);

}
