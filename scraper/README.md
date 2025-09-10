# Medical Data Scraper for NiramoyAI

A Java-based web scraper to extract medical data including doctors, hospitals, and medical tests from healthcare websites.

## Features

- **Doctor Scraper**: Extracts doctor information including name, specialization, hospital, fees, ratings, etc.
- **Hospital Scraper**: Extracts hospital information including name, address, contact details, facilities, etc.
- **Medical Test Scraper**: Extracts medical test information including name, description, cost, hospital, etc.
- **Flexible CSS Selector Configuration**: Customize selectors for different website structures
- **JSON Output**: All scraped data is saved in JSON format for easy integration
- **Error Handling**: Robust error handling and logging

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher
- Internet connection

## Dependencies

- JSoup 1.17.2 - HTML parsing
- Gson 2.10.1 - JSON serialization
- Apache HttpClient 4.5.14 - HTTP operations
- SLF4J 2.0.9 - Logging

## Setup and Installation

### Quick Setup (Recommended)
1. Clone or download the scraper files
2. Navigate to the scraper directory
3. Run the automated setup:

```bash
cd scraper
# Make scripts executable
chmod +x *.sh
# Run the scraper with automated compilation
./run_scraper.sh
```

### Manual Setup
1. Download dependencies (already included):
   - `gson-2.10.1.jar`
   - `jsoup-1.17.2.jar`

2. Compile and run:
```bash
# Compile
javac -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar *.java

# Quick doctor search
java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar SasthyasebaScraper "doctor name"

# Full interactive menu
java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar com.niramoyai.scraper.ScraperMain
```

## Quick Start

### Option 1: Use the automated build and run script
```bash
./run_scraper.sh
```

### Option 2: Quick doctor search (Sasthyaseba.com)
```bash
# Search for a specific doctor
java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar SasthyasebaScraper "doctor name"

# Examples:
java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar SasthyasebaScraper "mostofa"
java -cp .:gson-2.10.1.jar:jsoup-1.17.2.jar SasthyasebaScraper "karim rahman"
```

### Option 3: Environment variable approach
```bash
# Set the environment URL base
export DOCTOR_SEARCH_URL="https://sasthyaseba.com/search?q="

# Use the dedicated script
./scrape_doctors.sh "doctor name"
```

## Usage

### Interactive Mode

Run the main class and follow the interactive prompts:

```bash
java -cp target/classes:target/dependency/* com.niramoyai.scraper.ScraperMain
```

The program will ask you to:
1. Choose what to scrape (doctors, hospitals, medical tests, or all)
2. Provide the URL to scrape from
3. Optionally customize CSS selectors

### Programmatic Usage

#### Scraping Doctors

```java
import com.niramoyai.scraper.DoctorScraper;
import java.util.*;

// Define CSS selectors for the website
Map<String, String> selectors = new HashMap<>();
selectors.put("container", ".doctor-list");           // Container holding all doctor cards
selectors.put("name", ".doctor-name");                // Doctor name element
selectors.put("specialization", ".specialization");   // Specialization element
selectors.put("hospital", ".hospital");               // Hospital name element
selectors.put("fee", ".consultation-fee");            // Consultation fee element
selectors.put("rating", ".rating");                   // Rating element

// Scrape doctors
String url = "https://example-medical-site.com/doctors";
List<DoctorScraper.Doctor> doctors = DoctorScraper.scrapeDoctors(url, selectors);

// Save to JSON
DoctorScraper.saveToJson(doctors, "doctors.json");
```

#### Scraping Hospitals

```java
import com.niramoyai.scraper.HospitalScraper;
import java.util.*;

Map<String, String> selectors = new HashMap<>();
selectors.put("container", ".hospital-list");
selectors.put("name", ".hospital-name");
selectors.put("address", ".address");
selectors.put("phone", ".phone");
selectors.put("type", ".hospital-type");

String url = "https://example-medical-site.com/hospitals";
List<HospitalScraper.Hospital> hospitals = HospitalScraper.scrapeHospitals(url, selectors);
HospitalScraper.saveToJson(hospitals, "hospitals.json");
```

#### Scraping Medical Tests

```java
import com.niramoyai.scraper.MedicalTestScraper;
import java.util.*;

Map<String, String> selectors = new HashMap<>();
selectors.put("container", ".test-list");
selectors.put("name", ".test-name");
selectors.put("description", ".description");
selectors.put("cost", ".cost");
selectors.put("hospital", ".hospital");

String url = "https://example-medical-site.com/tests";
List<MedicalTestScraper.MedicalTest> tests = MedicalTestScraper.scrapeMedicalTests(url, selectors);
MedicalTestScraper.saveToJson(tests, "medical_tests.json");
```

## CSS Selector Configuration

### Common Selectors for Different Websites

#### For Doctor Data:
- `container`: `.doctor-list`, `.doctors-container`, `.search-results`
- `name`: `.doctor-name`, `.name`, `h3`, `h4`
- `specialization`: `.specialization`, `.specialty`, `.department`
- `hospital`: `.hospital`, `.clinic`, `.institution`
- `fee`: `.fee`, `.price`, `.consultation-fee`
- `rating`: `.rating`, `.stars`, `.score`

#### For Hospital Data:
- `container`: `.hospital-list`, `.hospitals-container`
- `name`: `.hospital-name`, `.name`, `h3`
- `address`: `.address`, `.location`
- `phone`: `.phone`, `.contact`, `.mobile`
- `type`: `.hospital-type`, `.category`

#### For Medical Test Data:
- `container`: `.test-list`, `.tests-container`
- `name`: `.test-name`, `.name`
- `description`: `.description`, `.details`
- `cost`: `.cost`, `.price`, `.fee`
- `hospital`: `.hospital`, `.clinic`

## Output Format

### Doctor JSON Structure
```json
[
  {
    "name": "Dr. John Doe",
    "specialization": "Cardiologist",
    "qualification": "MBBS, MD",
    "experience": "10+ years",
    "hospital": "City Hospital",
    "location": "Dhaka",
    "consultationFee": "৳1000",
    "rating": "4.5",
    "reviewCount": "120",
    "availableDays": "Mon-Fri",
    "contactNumber": "+8801234567890",
    "profileUrl": "https://example.com/doctor/1"
  }
]
```

### Hospital JSON Structure
```json
[
  {
    "name": "City General Hospital",
    "type": "Private",
    "address": "123 Main Street, Dhaka",
    "area": "Dhanmondi",
    "city": "Dhaka",
    "phoneNumber": "+8802-9876543",
    "email": "info@cityhospital.com",
    "website": "https://cityhospital.com",
    "emergencyContact": "+8802-9876544",
    "establishedYear": "1995",
    "bedCapacity": "200",
    "departments": "Cardiology, Neurology, Pediatrics",
    "facilities": "ICU, Emergency, Lab",
    "specialties": "Heart Surgery, Brain Surgery",
    "rating": "4.2",
    "reviewCount": "89"
  }
]
```

### Medical Test JSON Structure
```json
[
  {
    "name": "Complete Blood Count (CBC)",
    "description": "Comprehensive blood test to check overall health",
    "category": "Blood Test",
    "preparationInstructions": "8-12 hours fasting required",
    "testType": "Laboratory",
    "duration": "30 minutes",
    "cost": "৳500",
    "hospital": "Lab One",
    "hospitalAddress": "456 Lab Street, Dhaka",
    "department": "Pathology",
    "availability": "Daily 8AM-8PM",
    "reportDeliveryTime": "24 hours",
    "requiredFasting": "Yes",
    "bookingRequired": "Yes",
    "contactNumber": "+8801234567891"
  }
]
```

## Tips for Effective Scraping

1. **Inspect the Website**: Use browser developer tools to identify the correct CSS selectors
2. **Test Selectors**: Start with a small test to verify selectors work correctly
3. **Handle Rate Limiting**: Add delays between requests if needed
4. **Respect robots.txt**: Check the website's robots.txt file
5. **Error Handling**: The scraper includes built-in error handling, but monitor logs for issues

## Website-Specific Examples

### Example 1: Medical Portal
```java
Map<String, String> selectors = new HashMap<>();
selectors.put("container", ".doctor-profile-card");
selectors.put("name", ".doctor-name h4");
selectors.put("specialization", ".specialty-text");
selectors.put("hospital", ".clinic-name");
selectors.put("fee", ".fee-amount");
```

### Example 2: Hospital Directory
```java
Map<String, String> selectors = new HashMap<>();
selectors.put("container", ".hospital-item");
selectors.put("name", ".hospital-title");
selectors.put("address", ".address-line");
selectors.put("phone", ".contact-number");
```

## Troubleshooting

### Common Issues:

1. **No data scraped**: 
   - Check if the URL is accessible
   - Verify CSS selectors are correct
   - Check if the website requires authentication

2. **Partial data**: 
   - Some elements might be loaded dynamically via JavaScript
   - Consider using Selenium for JavaScript-heavy sites

3. **Access denied (403/429 errors)**:
   - The website might be blocking automated requests
   - Try using different User-Agent strings
   - Add delays between requests

## Contributing

To extend the scraper for new websites:

1. Create new selector mappings for the target website
2. Test with a small dataset first
3. Add website-specific handling if needed
4. Update the documentation with new examples

## Legal Considerations

- Always check the website's Terms of Service before scraping
- Respect robots.txt files
- Don't overload servers with too many requests
- Use scraped data responsibly and ethically
- Consider reaching out to website owners for API access

## License

This tool is created for educational and research purposes. Please ensure compliance with applicable laws and website terms of service when using this scraper.
