package com.example.niramoy.repository.graphDB;

import java.util.List;
import java.util.Map;

public interface GraphDB {
    List<Map<String, Object>> executeQuery(String cypherQuery);
    List<Map<String, Object>> executeQuery(String cypherQuery, Map<String, Object> parameters);
    boolean isConnected();
    String getSchema();
}
