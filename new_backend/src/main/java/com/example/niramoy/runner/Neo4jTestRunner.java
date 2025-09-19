package com.example.niramoy.runner;

import com.example.niramoy.service.UserKGService;
import com.example.niramoy.repository.graphDB.GraphDB;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;


@Slf4j
@RequiredArgsConstructor
// @Component
public class Neo4jTestRunner implements CommandLineRunner {
    private final GraphDB graphDB;
    private final UserKGService UserKGService;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Neo4j Connection Test ===");

        // Test with patient ID P002 (converting to Long)
        Long patientId = 999L; // P002 corresponds to patientID 2
        
        System.out.println("Testing getLatestTestNames with patient ID: P002 (patientID: " + patientId + ")");
        
        // Test the getLatestTestNames method
        String testNamesResult = UserKGService.getLatestTestNames(patientId);
        log.info("Latest Test Names for Patient P002: {}", testNamesResult);
        System.out.println("Latest Test Names Result: " + testNamesResult);
        System.out.println("=== End Neo4j Test ===");
    }
}
