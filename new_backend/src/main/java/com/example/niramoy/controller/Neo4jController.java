package com.example.niramoy.controller;

import com.example.niramoy.service.Neo4jService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/neo4j")
public class Neo4jController {

    private final Neo4jService neo4jService;

    public Neo4jController(Neo4jService neo4jService) {
        this.neo4jService = neo4jService;
    }

    /**
     * Test endpoint equivalent to the Python code
     * GET /api/neo4j/test
     */
    @GetMapping("/test")
    public ResponseEntity<List<Map<String, Object>>> testConnection() {
        try {
            List<Map<String, Object>> results = neo4jService.getFirst3Nodes();
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Execute custom Cypher query
     * GET /api/neo4j/query?cypher=MATCH (n) RETURN n LIMIT 5
     */
    @GetMapping("/query")
    public ResponseEntity<List<Map<String, Object>>> executeQuery(@RequestParam String cypher) {
        try {
            List<Map<String, Object>> results = neo4jService.executeQuery(cypher);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get database schema
     * GET /api/neo4j/schema
     */
    @GetMapping("/schema")
    public ResponseEntity<String> getSchema() {
        try {
            String schema = neo4jService.getSchema();
            return ResponseEntity.ok(schema);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Check Neo4j connection health
     * GET /api/neo4j/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        boolean connected = neo4jService.isConnected();
        return ResponseEntity.ok(Map.of(
            "status", connected ? "UP" : "DOWN",
            "database", "Neo4j"
        ));
    }
}
