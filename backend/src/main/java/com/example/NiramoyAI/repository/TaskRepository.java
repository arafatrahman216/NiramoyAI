package com.example.NiramoyAI.repository;


import com.example.NiramoyAI.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
