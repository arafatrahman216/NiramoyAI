package com.example.niramoy.runner;

import com.example.niramoy.service.Neo4jService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;


@Component
public class Neo4jTestRunner implements CommandLineRunner {

    private final Neo4jService neo4jService;

    public Neo4jTestRunner(Neo4jService neo4jService) {
        this.neo4jService = neo4jService;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== Neo4j Connection Test ===");
        
        try {
            // Test connection
            if (neo4jService.isConnected()) {
                System.out.println("✅ Neo4j connection successful!");
                
                // Execute the equivalent query from your Python script
                List<Map<String, Object>> results = neo4jService.executeQuery("MATCH (n) RETURN n LIMIT 3");
                System.out.println("Query results:");
                System.out.println(results);
                
                // You can also print the schema if needed (uncomment below)
                // System.out.println("\nDatabase schema:");
                // System.out.println(neo4jService.getSchema());
                
            } else {
                System.out.println("❌ Neo4j connection failed!");
            }
        } catch (Exception e) {
            System.out.println("❌ Neo4j connection error: " + e.getMessage());
        }
        
        System.out.println("=== End Neo4j Test ===");
    }
}
