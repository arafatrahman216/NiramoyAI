#!/bin/bash

# NiramoyAI Scraper Build and Run Script
# This script compiles and runs the medical data scraper

echo "=========================================="
echo "   NiramoyAI Medical Data Scraper"
echo "=========================================="

# Check if required JAR files exist
if [ ! -f "gson-2.10.1.jar" ] || [ ! -f "jsoup-1.17.2.jar" ]; then
    echo "Error: Required JAR files not found!"
    echo "Please ensure gson-2.10.1.jar and jsoup-1.17.2.jar are in the current directory."
    exit 1
fi

# Compile Java files (DoctorScraper, HospitalScraper, and AllDoctor)
echo "Compiling scrapers..."
javac -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar DoctorScraper.java HospitalScraper.java AllDoctor.java

if [ $? -ne 0 ]; then
    echo "Error: Compilation failed!"
    exit 1
fi

echo "✓ Compilation successful!"
echo ""

# Menu for different scraping options
echo "Select scraping option:"
echo "1. Doctor search (DoctorScraper)"
echo "2. Hospital search (HospitalScraper)"
echo "3. All doctors scraping (AllDoctor - scrapes ALL doctors with pagination)"
echo "4. Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        read -p "Enter doctor name to search: " doctor_name
        if [ -z "$doctor_name" ]; then
            echo "Doctor name cannot be empty!"
            exit 1
        fi
        echo ""
        echo "Running doctor search..."
        java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar DoctorScraper "$doctor_name"
        ;;
    2)
        echo ""
        read -p "Enter hospital name to search: " hospital_name
        if [ -z "$hospital_name" ]; then
            echo "Hospital name cannot be empty!"
            exit 1
        fi
        echo ""
        echo "Running hospital search..."
        java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar HospitalScraper "$hospital_name"
        ;;
    3)
        echo ""
        echo "Starting comprehensive ALL doctors scraping..."
        echo "WARNING: This may take several minutes depending on the number of pages!"
        echo "Press Ctrl+C to stop if needed."
        echo ""
        read -p "Do you want to continue? (y/n): " confirm
        if [[ $confirm =~ ^[Yy]$ ]]; then
            echo "Running AllDoctor scraper..."
            java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar AllDoctor
        else
            echo "AllDoctor scraping cancelled."
        fi
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "Scraping completed!"
echo ""
echo "Generated files:"
ls -la *.json 2>/dev/null || echo "No JSON files found."
echo "=========================================="
