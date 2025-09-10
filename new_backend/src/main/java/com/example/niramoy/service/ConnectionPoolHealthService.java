package com.example.niramoy.service;

import com.zaxxer.hikari.HikariDataSource;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConnectionPoolHealthService {
    
    private final DataSource dataSource;
    
    @Scheduled(fixedRate = 30000) // Check every 30 seconds
    public void logConnectionPoolStatus() {
        if (dataSource instanceof HikariDataSource) {
            HikariDataSource hikariDataSource = (HikariDataSource) dataSource;
            
            int activeConnections = hikariDataSource.getHikariPoolMXBean().getActiveConnections();
            int idleConnections = hikariDataSource.getHikariPoolMXBean().getIdleConnections();
            int totalConnections = hikariDataSource.getHikariPoolMXBean().getTotalConnections();
            int threadsAwaitingConnection = hikariDataSource.getHikariPoolMXBean().getThreadsAwaitingConnection();
            
            if (activeConnections > 8 || threadsAwaitingConnection > 0) {
                log.warn("Connection pool warning - Active: {}, Idle: {}, Total: {}, Awaiting: {}", 
                    activeConnections, idleConnections, totalConnections, threadsAwaitingConnection);
            } else {
                log.debug("Connection pool status - Active: {}, Idle: {}, Total: {}, Awaiting: {}", 
                    activeConnections, idleConnections, totalConnections, threadsAwaitingConnection);
            }
        }
    }
}
