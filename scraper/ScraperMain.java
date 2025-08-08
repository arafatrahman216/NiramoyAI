package com.niramoyai.scraper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class ScraperMain {
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("==================================================");
        System.out.println("     Medical Data Scraper for NiramoyAI");
        System.out.println("==================================================");
        System.out.println("Choose what to scrape:");
        System.out.println("1. Doctor Data");
        System.out.println("2. Hospital Data");
        System.out.println("3. Medical Test Data");
        System.out.println("4. Scrape All");
        System.out.println("5. Exit");
        System.out.print("Enter your choice (1-5): ");
        
        int choice = scanner.nextInt();
        scanner.nextLine(); // consume newline
        
        switch (choice) {
            case 1:
                scrapeDoctors(scanner);
                break;
            case 2:
                scrapeHospitals(scanner);
                break;
            case 3:
                scrapeMedicalTests(scanner);
                break;
            case 4:
                scrapeAll(scanner);
                break;
            case 5:
                System.out.println("Exiting...");
                break;
            default:
                System.out.println("Invalid choice!");
        }
        
        scanner.close();
    }
    
    private static void scrapeDoctors(Scanner scanner) {
        System.out.println("\n=== Doctor Data Scraper ===");
        System.out.print("Enter doctor name to search (e.g., 'mostofa'): ");
        String doctorName = scanner.nextLine().trim();
        
        if (doctorName.isEmpty()) {
            System.out.println("Doctor name cannot be empty!");
            return;
        }
        
        // Use environment base URL or default
        String baseUrl = System.getenv("DOCTOR_SEARCH_URL");
        if (baseUrl == null || baseUrl.isEmpty()) {
            baseUrl = "https://sasthyaseba.com/search?q=";
        }
        
        // Build full search URL
        String fullUrl = DoctorScraper.buildSearchUrl(baseUrl, doctorName);
        System.out.println("Searching URL: " + fullUrl);
        
        // Create instance and get custom selectors or use defaults
        DoctorScraper doctorScraper = new DoctorScraper();
        Map<String, String> selectors = getDoctorSelectors(scanner);
        
        // If no custom selectors provided, use sasthyaseba defaults
        if (selectors.isEmpty()) {
            selectors = DoctorScraper.getSasthyasebaSelectors();
            System.out.println("Using sasthyaseba.com selectors");
        }
        
        System.out.println("Scraping doctors...");
        List<DoctorScraper.Doctor> doctors = doctorScraper.scrapeDoctors(fullUrl, selectors);
        
        if (!doctors.isEmpty()) {
            System.out.println("Found " + doctors.size() + " doctors:");
            for (DoctorScraper.Doctor doctor : doctors) {
                System.out.println("- " + doctor.getName() + " (" + doctor.getSpecialization() + ")");
            }
            
            String filename = "doctors_" + doctorName.replaceAll("[^a-zA-Z0-9]", "_") + ".json";
            DoctorScraper.saveToJson(doctors, filename);
            System.out.println("Doctor data saved to " + filename);
        } else {
            System.out.println("No doctors found. The page structure might have changed.");
        }
    }
    
    private static void scrapeHospitals(Scanner scanner) {
        System.out.println("\n=== Hospital Data Scraper ===");
        System.out.print("Enter the URL to scrape hospitals from: ");
        String url = scanner.nextLine();
        
        // Get custom selectors or use defaults
        Map<String, String> selectors = getHospitalSelectors(scanner);
        
        System.out.println("Scraping hospitals...");
        List<HospitalScraper.Hospital> hospitals = HospitalScraper.scrapeHospitals(url, selectors);
        
        HospitalScraper.saveToJson(hospitals, "hospitals.json");
        System.out.println("Hospital data saved to hospitals.json");
    }
    
    private static void scrapeMedicalTests(Scanner scanner) {
        System.out.println("\n=== Medical Test Data Scraper ===");
        System.out.print("Enter the URL to scrape medical tests from: ");
        String url = scanner.nextLine();
        
        // Get custom selectors or use defaults
        Map<String, String> selectors = getMedicalTestSelectors(scanner);
        
        System.out.println("Scraping medical tests...");
        List<MedicalTestScraper.MedicalTest> tests = MedicalTestScraper.scrapeMedicalTests(url, selectors);
        
        MedicalTestScraper.saveToJson(tests, "medical_tests.json");
        System.out.println("Medical test data saved to medical_tests.json");
    }
    
    private static void scrapeAll(Scanner scanner) {
        System.out.println("\n=== Scraping All Data ===");
        
        // Doctor scraping
        System.out.print("Enter the URL for doctors: ");
        String doctorUrl = scanner.nextLine();
        Map<String, String> doctorSelectors = getDoctorSelectors(scanner);
        DoctorScraper doctorScraper = new DoctorScraper();
        List<DoctorScraper.Doctor> doctors = doctorScraper.scrapeDoctors(doctorUrl, doctorSelectors);
        DoctorScraper.saveToJson(doctors, "doctors.json");
        
        // Hospital scraping
        System.out.print("Enter the URL for hospitals: ");
        String hospitalUrl = scanner.nextLine();
        Map<String, String> hospitalSelectors = getHospitalSelectors(scanner);
        List<HospitalScraper.Hospital> hospitals = HospitalScraper.scrapeHospitals(hospitalUrl, hospitalSelectors);
        HospitalScraper.saveToJson(hospitals, "hospitals.json");
        
        // Medical test scraping
        System.out.print("Enter the URL for medical tests: ");
        String testUrl = scanner.nextLine();
        Map<String, String> testSelectors = getMedicalTestSelectors(scanner);
        List<MedicalTestScraper.MedicalTest> tests = MedicalTestScraper.scrapeMedicalTests(testUrl, testSelectors);
        MedicalTestScraper.saveToJson(tests, "medical_tests.json");
        
        System.out.println("All data scraped and saved successfully!");
    }
    
    private static Map<String, String> getDoctorSelectors(Scanner scanner) {
        Map<String, String> selectors = new HashMap<>();
        
        System.out.println("\nDo you want to customize CSS selectors? (y/n): ");
        String customize = scanner.nextLine();
        
        if (customize.toLowerCase().startsWith("y")) {
            System.out.println("Enter CSS selectors (press Enter for default):");
            
            System.out.print("Container selector (default: .doctor-list): ");
            String container = scanner.nextLine();
            if (!container.trim().isEmpty()) selectors.put("container", container);
            
            System.out.print("Doctor name selector (default: .doctor-name): ");
            String name = scanner.nextLine();
            if (!name.trim().isEmpty()) selectors.put("name", name);
            
            System.out.print("Specialization selector (default: .specialization): ");
            String specialization = scanner.nextLine();
            if (!specialization.trim().isEmpty()) selectors.put("specialization", specialization);
            
            System.out.print("Hospital selector (default: .hospital): ");
            String hospital = scanner.nextLine();
            if (!hospital.trim().isEmpty()) selectors.put("hospital", hospital);
            
            System.out.print("Fee selector (default: .fee): ");
            String fee = scanner.nextLine();
            if (!fee.trim().isEmpty()) selectors.put("fee", fee);
            
            // Add more selectors as needed
        }
        
        return selectors;
    }
    
    private static Map<String, String> getHospitalSelectors(Scanner scanner) {
        Map<String, String> selectors = new HashMap<>();
        
        System.out.println("\nDo you want to customize CSS selectors? (y/n): ");
        String customize = scanner.nextLine();
        
        if (customize.toLowerCase().startsWith("y")) {
            System.out.println("Enter CSS selectors (press Enter for default):");
            
            System.out.print("Container selector (default: .hospital-list): ");
            String container = scanner.nextLine();
            if (!container.trim().isEmpty()) selectors.put("container", container);
            
            System.out.print("Hospital name selector (default: .hospital-name): ");
            String name = scanner.nextLine();
            if (!name.trim().isEmpty()) selectors.put("name", name);
            
            System.out.print("Address selector (default: .address): ");
            String address = scanner.nextLine();
            if (!address.trim().isEmpty()) selectors.put("address", address);
            
            System.out.print("Phone selector (default: .phone): ");
            String phone = scanner.nextLine();
            if (!phone.trim().isEmpty()) selectors.put("phone", phone);
            
            // Add more selectors as needed
        }
        
        return selectors;
    }
    
    private static Map<String, String> getMedicalTestSelectors(Scanner scanner) {
        Map<String, String> selectors = new HashMap<>();
        
        System.out.println("\nDo you want to customize CSS selectors? (y/n): ");
        String customize = scanner.nextLine();
        
        if (customize.toLowerCase().startsWith("y")) {
            System.out.println("Enter CSS selectors (press Enter for default):");
            
            System.out.print("Container selector (default: .test-list): ");
            String container = scanner.nextLine();
            if (!container.trim().isEmpty()) selectors.put("container", container);
            
            System.out.print("Test name selector (default: .test-name): ");
            String name = scanner.nextLine();
            if (!name.trim().isEmpty()) selectors.put("name", name);
            
            System.out.print("Description selector (default: .description): ");
            String description = scanner.nextLine();
            if (!description.trim().isEmpty()) selectors.put("description", description);
            
            System.out.print("Cost selector (default: .cost): ");
            String cost = scanner.nextLine();
            if (!cost.trim().isEmpty()) selectors.put("cost", cost);
            
            System.out.print("Hospital selector (default: .hospital): ");
            String hospital = scanner.nextLine();
            if (!hospital.trim().isEmpty()) selectors.put("hospital", hospital);
            
            // Add more selectors as needed
        }
        
        return selectors;
    }
    
    // Example usage with predefined popular medical websites
    public static void exampleUsage() {
        // Example 1: Scraping from a hypothetical Bangladeshi medical website
        System.out.println("Example 1: Scraping doctors from a medical portal");
        
        Map<String, String> doctorSelectors = new HashMap<>();
        doctorSelectors.put("container", ".doctor-listing");
        doctorSelectors.put("name", ".doc-name h3");
        doctorSelectors.put("specialization", ".doc-specialty");
        doctorSelectors.put("hospital", ".doc-hospital");
        doctorSelectors.put("fee", ".consultation-fee span");
        doctorSelectors.put("rating", ".rating-value");
        
        String doctorUrl = "https://example-medical-site.com/find-doctors";
        DoctorScraper doctorScraper = new DoctorScraper();
        List<DoctorScraper.Doctor> doctors = doctorScraper.scrapeDoctors(doctorUrl, doctorSelectors);
        DoctorScraper.saveToJson(doctors, "example_doctors.json");
        
        // Example 2: Scraping hospitals
        System.out.println("Example 2: Scraping hospitals");
        
        Map<String, String> hospitalSelectors = new HashMap<>();
        hospitalSelectors.put("container", ".hospital-grid");
        hospitalSelectors.put("name", ".hospital-title");
        hospitalSelectors.put("address", ".hospital-address");
        hospitalSelectors.put("phone", ".contact-phone");
        hospitalSelectors.put("type", ".hospital-type");
        
        String hospitalUrl = "https://example-medical-site.com/hospitals";
        List<HospitalScraper.Hospital> hospitals = HospitalScraper.scrapeHospitals(hospitalUrl, hospitalSelectors);
        HospitalScraper.saveToJson(hospitals, "example_hospitals.json");
        
        // Example 3: Scraping medical tests
        System.out.println("Example 3: Scraping medical tests");
        
        Map<String, String> testSelectors = new HashMap<>();
        testSelectors.put("container", ".test-catalog");
        testSelectors.put("name", ".test-title");
        testSelectors.put("cost", ".test-price");
        testSelectors.put("description", ".test-description");
        testSelectors.put("hospital", ".available-at");
        
        String testUrl = "https://example-medical-site.com/diagnostic-tests";
        List<MedicalTestScraper.MedicalTest> tests = MedicalTestScraper.scrapeMedicalTests(testUrl, testSelectors);
        MedicalTestScraper.saveToJson(tests, "example_medical_tests.json");
        
        System.out.println("All example data scraped successfully!");
    }
}
