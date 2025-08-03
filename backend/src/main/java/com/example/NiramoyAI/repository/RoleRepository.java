package com.example.NiramoyAI.repository;

import com.example.NiramoyAI.model.Role;
import com.example.NiramoyAI.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
