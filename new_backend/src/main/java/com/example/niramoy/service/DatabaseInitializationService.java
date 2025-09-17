// package com.example.niramoy.service;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.stereotype.Service;

// @Service
// public class DatabaseInitializationService implements CommandLineRunner {
    
//     private final JdbcTemplate jdbcTemplate;
    
//     public DatabaseInitializationService(JdbcTemplate jdbcTemplate) {
//         this.jdbcTemplate = jdbcTemplate;
//     }
    
//     @Override
//     public void run(String... args) throws Exception {
//         try {
//             // Check and fix messages table content column type
//             String checkColumnQuery = 
//                 "SELECT data_type, character_maximum_length " +
//                 "FROM information_schema.columns " +
//                 "WHERE table_name = 'messages' AND column_name = 'content'";
            
//             jdbcTemplate.queryForList(checkColumnQuery).forEach(row -> {
//                 String dataType = (String) row.get("data_type");
//                 Integer maxLength = (Integer) row.get("character_maximum_length");
                
//                 System.out.println("Current messages.content column type: " + dataType + 
//                     (maxLength != null ? " with max length: " + maxLength : " (unlimited)"));
                
//                 if ("character varying".equals(dataType) && maxLength != null && maxLength <= 255) {
//                     System.out.println("Fixing messages.content column - converting from VARCHAR(" + maxLength + ") to TEXT");
//                     try {
//                         jdbcTemplate.execute("ALTER TABLE messages ALTER COLUMN content TYPE TEXT");
//                         System.out.println("Successfully updated messages.content column to TEXT type");
//                     } catch (Exception e) {
//                         System.err.println("Failed to alter column: " + e.getMessage());
//                     }
//                 } else if ("text".equals(dataType)) {
//                     System.out.println("messages.content column is already TEXT type - no changes needed");
//                 }
//             });
            
//         } catch (Exception e) {
//             System.err.println("Warning: Could not check/fix database schema: " + e.getMessage());
//             // Don't fail startup if schema check fails
//         }
//     }
// }
