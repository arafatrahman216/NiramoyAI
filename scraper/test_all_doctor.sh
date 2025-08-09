#!/bin/bash

# Quick test script for AllDoctor scraper (limited pages)
echo "=========================================="
echo "   AllDoctor Scraper - Quick Test"
echo "=========================================="

# Check if required JAR files exist
if [ ! -f "gson-2.10.1.jar" ] || [ ! -f "jsoup-1.17.2.jar" ]; then
    echo "Error: Required JAR files not found!"
    echo "Please ensure gson-2.10.1.jar and jsoup-1.17.2.jar are in the current directory."
    exit 1
fi

# Compile AllDoctor
echo "Compiling AllDoctor..."
javac -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar AllDoctor.java

if [ $? -ne 0 ]; then
    echo "Error: Compilation failed!"
    exit 1
fi

echo "✓ Compilation successful!"
echo ""

# Run with a time limit for testing
echo "Running AllDoctor scraper (limited test - 60 seconds)..."
echo "This will scrape multiple pages and then stop for testing purposes."
echo ""

timeout 60 java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar AllDoctor

echo ""
echo "=========================================="
echo "Quick test completed!"
echo ""
echo "Generated files:"
ls -la all_doctors_*.json 2>/dev/null || echo "No JSON files found."
echo "=========================================="
