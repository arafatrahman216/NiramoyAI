package com.example.niramoy.runner;

import com.example.niramoy.service.UserKGService;
import com.example.niramoy.repository.graphDB.GraphDB;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Component
public class Neo4jTestRunner implements CommandLineRunner {
    private final GraphDB graphDB;
    private final UserKGService UserKGService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Neo4j Connection Test ===");

        String ans1 = UserKGService.getVisitSummaryLastThree(2L);
        log.info("Patient Summary: {}", ans1);
        String ans2 = UserKGService.getDoctorAdvice(2L);
        log.info("Patient Visit History: {}", ans2);
        String ans3 = UserKGService.getPatientSummary(2L);
        log.info("Patient Summary: {}", ans3);


        System.out.println("=== End Neo4j Test ===");
    }
}
