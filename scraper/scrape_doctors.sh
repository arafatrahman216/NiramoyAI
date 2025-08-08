#!/bin/bash

# NiramoyAI Doctor Scraper
# Usage: ./scrape_doctors.sh [doctor_name]

# Set the environment variable as you specified
export DOCTOR_SEARCH_URL="https://sasthyaseba.com/search?q="

# Get doctor name from command line argument or prompt user
if [ $# -eq 0 ]; then
    echo "Enter doctor name to search:"
    read DOCTOR_NAME
else
    DOCTOR_NAME="$1"
fi

echo "=========================================="
echo "   NiramoyAI Medical Data Scraper"
echo "=========================================="
echo "Environment URL: $DOCTOR_SEARCH_URL"
echo "Searching for: $DOCTOR_NAME"
echo "=========================================="

# Run the Java scraper
java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar SasthyasebaScraper "$DOCTOR_NAME"

echo "=========================================="
echo "Scraping completed!"
echo "Check the generated JSON file for results."
echo "=========================================="
