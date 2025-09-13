package com.example.niramoy.config;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PreDestroy;

@Configuration
public class Neo4jConfig {

    @Value("${neo4j.uri}")
    private String neo4jUri;

    @Value("${neo4j.username}")
    private String neo4jUsername;

    @Value("${neo4j.password}")
    private String neo4jPassword;

    private Driver driver;

    @Bean
    public Driver neo4jDriver() {
        driver = GraphDatabase.driver(neo4jUri, AuthTokens.basic(neo4jUsername, neo4jPassword));
        return driver;
    }

    @PreDestroy
    public void closeDriver() {
        if (driver != null) {
            driver.close();
        }
    }
}
