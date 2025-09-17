package com.example.niramoy.service;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class Neo4jService {

    private final Driver driver;

    public Neo4jService(Driver driver) {
        this.driver = driver;
    }

    /**
     * Execute a Cypher query and return results as a list of maps
     * This is equivalent to the Python graph.query() method
     */
    public List<Map<String, Object>> executeQuery(String cypherQuery) {
        try (Session session = driver.session()) {
            Result result = session.run(cypherQuery);
            return result.list(record -> record.asMap());
        }
    }

    /**
     * Execute a Cypher query with parameters
     */
    public List<Map<String, Object>> executeQuery(String cypherQuery, Map<String, Object> parameters) {
        try (Session session = driver.session()) {
            Result result = session.run(cypherQuery, parameters);
            return result.list(record -> record.asMap());
        }
    }

    /**
     * Get database schema information
     * Equivalent to graph.schema in Python
     */
    public String getSchema() {
        try (Session session = driver.session()) {
            Result result = session.run("CALL db.schema.visualization()");
            return result.list().toString();
        }
    }

    /**
     * Test method equivalent to the Python code:
     * results = graph.query("MATCH (n) RETURN n LIMIT 3")
     */
    public List<Map<String, Object>> getFirst3Nodes() {
        return executeQuery("MATCH (n) RETURN n LIMIT 3");
    }

    /**
     * Check if Neo4j connection is working
     */
    public boolean isConnected() {
        try (Session session = driver.session()) {
            Result result = session.run("RETURN 1 as test");
            return result.hasNext();
        } catch (Exception e) {
            return false;
        }
    }
}
