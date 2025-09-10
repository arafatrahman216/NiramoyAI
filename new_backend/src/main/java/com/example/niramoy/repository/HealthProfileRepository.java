package com.example.niramoy.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.niramoy.entity.HealthProfile;

@Repository
public interface HealthProfileRepository extends JpaRepository<HealthProfile, Long> {
    HealthProfile findByUserId(Long userId);
}
