package com.example.niramoy.repository;

import com.example.niramoy.entity.HealthLog;
import com.example.niramoy.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HealthLogRepository extends JpaRepository<HealthLog, Long> {

    Page<HealthLog> findByUser(User user, Pageable pageable);

    Page<HealthLog> findByUserOrderByLogDatetimeDesc(User user, Pageable pageable);
}
