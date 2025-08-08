#!/bin/bash

# NiramoyAI Scraper Directory Cleanup Script
# This script removes test files and cleans up the scraper directory

echo "=========================================="
echo "   NiramoyAI Scraper Directory Cleanup"
echo "=========================================="

# List current files
echo "Current files in directory:"
ls -la

echo ""
echo "Files to be removed:"

# Check for test files
if ls test_*.json >/dev/null 2>&1; then
    echo "- Test JSON files: $(ls test_*.json | tr '\n' ' ')"
fi

if ls TestScraper.* >/dev/null 2>&1; then
    echo "- Test scraper files: $(ls TestScraper.* | tr '\n' ' ')"
fi

# Check for compiled class files (optional cleanup)
if ls *.class >/dev/null 2>&1; then
    echo "- Compiled class files: $(ls *.class | tr '\n' ' ')"
fi

# Check for temporary files
if ls *.tmp >/dev/null 2>&1; then
    echo "- Temporary files: $(ls *.tmp | tr '\n' ' ')"
fi

# Check for backup files
if ls *.bak >/dev/null 2>&1; then
    echo "- Backup files: $(ls *.bak | tr '\n' ' ')"
fi

echo ""
read -p "Do you want to proceed with cleanup? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo ""
    echo "Cleaning up test files..."
    
    # Remove test JSON files
    if ls test_*.json >/dev/null 2>&1; then
        rm test_*.json
        echo "✓ Removed test JSON files"
    fi
    
    # Remove test scraper files
    if ls TestScraper.* >/dev/null 2>&1; then
        rm TestScraper.*
        echo "✓ Removed test scraper files"
    fi
    
    # Remove compiled class files (optional)
    read -p "Remove compiled .class files? (y/N): " remove_class
    if [[ $remove_class =~ ^[Yy]$ ]]; then
        if ls *.class >/dev/null 2>&1; then
            rm *.class
            echo "✓ Removed compiled class files"
        fi
    fi
    
    # Remove temporary files
    if ls *.tmp >/dev/null 2>&1; then
        rm *.tmp
        echo "✓ Removed temporary files"
    fi
    
    # Remove backup files
    if ls *.bak >/dev/null 2>&1; then
        rm *.bak
        echo "✓ Removed backup files"
    fi
    
    echo ""
    echo "=========================================="
    echo "Cleanup completed!"
    echo "=========================================="
    echo ""
    echo "Remaining files:"
    ls -la
    
    echo ""
    echo "Core scraper files preserved:"
    echo "- DoctorScraper.java"
    echo "- HospitalScraper.java" 
    echo "- MedicalTestScraper.java"
    echo "- ScraperMain.java"
    echo "- SasthyasebaScraper.java"
    echo "- pom.xml"
    echo "- README.md"
    echo "- Dependencies: gson-2.10.1.jar, jsoup-1.17.2.jar"
    echo "- Scripts: scrape_doctors.sh, cleanup.sh"
    
else
    echo "Cleanup cancelled."
fi

echo "=========================================="
