package com.niramoyai.scraper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MedicalTestScraper {
    
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    private static final int TIMEOUT = 10000;
    
    public static class MedicalTest {
        private String name;
        private String description;
        private String category; // Blood Test, Imaging, Pathology, etc.
        private String preparationInstructions;
        private String testType; // Lab, Scan, X-ray, etc.
        private String duration;
        private String cost;
        private String hospital;
        private String hospitalAddress;
        private String department;
        private String availability;
        private String reportDeliveryTime;
        private String requiredFasting;
        private String ageRestrictions;
        private String genderSpecific;
        private String bookingRequired;
        private String contactNumber;
        private String onlineBookingUrl;
        private String additionalInfo;
        
        // Constructors
        public MedicalTest() {}
        
        public MedicalTest(String name, String description, String category, String preparationInstructions,
                          String testType, String duration, String cost, String hospital, String hospitalAddress,
                          String department, String availability, String reportDeliveryTime, String requiredFasting,
                          String ageRestrictions, String genderSpecific, String bookingRequired,
                          String contactNumber, String onlineBookingUrl, String additionalInfo) {
            this.name = name;
            this.description = description;
            this.category = category;
            this.preparationInstructions = preparationInstructions;
            this.testType = testType;
            this.duration = duration;
            this.cost = cost;
            this.hospital = hospital;
            this.hospitalAddress = hospitalAddress;
            this.department = department;
            this.availability = availability;
            this.reportDeliveryTime = reportDeliveryTime;
            this.requiredFasting = requiredFasting;
            this.ageRestrictions = ageRestrictions;
            this.genderSpecific = genderSpecific;
            this.bookingRequired = bookingRequired;
            this.contactNumber = contactNumber;
            this.onlineBookingUrl = onlineBookingUrl;
            this.additionalInfo = additionalInfo;
        }
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        
        public String getPreparationInstructions() { return preparationInstructions; }
        public void setPreparationInstructions(String preparationInstructions) { this.preparationInstructions = preparationInstructions; }
        
        public String getTestType() { return testType; }
        public void setTestType(String testType) { this.testType = testType; }
        
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        
        public String getCost() { return cost; }
        public void setCost(String cost) { this.cost = cost; }
        
        public String getHospital() { return hospital; }
        public void setHospital(String hospital) { this.hospital = hospital; }
        
        public String getHospitalAddress() { return hospitalAddress; }
        public void setHospitalAddress(String hospitalAddress) { this.hospitalAddress = hospitalAddress; }
        
        public String getDepartment() { return department; }
        public void setDepartment(String department) { this.department = department; }
        
        public String getAvailability() { return availability; }
        public void setAvailability(String availability) { this.availability = availability; }
        
        public String getReportDeliveryTime() { return reportDeliveryTime; }
        public void setReportDeliveryTime(String reportDeliveryTime) { this.reportDeliveryTime = reportDeliveryTime; }
        
        public String getRequiredFasting() { return requiredFasting; }
        public void setRequiredFasting(String requiredFasting) { this.requiredFasting = requiredFasting; }
        
        public String getAgeRestrictions() { return ageRestrictions; }
        public void setAgeRestrictions(String ageRestrictions) { this.ageRestrictions = ageRestrictions; }
        
        public String getGenderSpecific() { return genderSpecific; }
        public void setGenderSpecific(String genderSpecific) { this.genderSpecific = genderSpecific; }
        
        public String getBookingRequired() { return bookingRequired; }
        public void setBookingRequired(String bookingRequired) { this.bookingRequired = bookingRequired; }
        
        public String getContactNumber() { return contactNumber; }
        public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
        
        public String getOnlineBookingUrl() { return onlineBookingUrl; }
        public void setOnlineBookingUrl(String onlineBookingUrl) { this.onlineBookingUrl = onlineBookingUrl; }
        
        public String getAdditionalInfo() { return additionalInfo; }
        public void setAdditionalInfo(String additionalInfo) { this.additionalInfo = additionalInfo; }
    }
    
    public static List<MedicalTest> scrapeMedicalTests(String url, Map<String, String> selectors) {
        List<MedicalTest> tests = new ArrayList<>();
        
        try {
            System.out.println("Scraping medical tests from: " + url);
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT)
                    .get();
            
            // Get the container element that holds all test cards
            String containerSelector = selectors.getOrDefault("container", ".test-list, .tests-container, .search-results");
            Elements testElements = doc.select(containerSelector + " > div, " + containerSelector + " > article, " + containerSelector + " > .test-card");
            
            if (testElements.isEmpty()) {
                // Try alternative selectors
                testElements = doc.select(".test-item, .test-listing, .diagnostic-test, .card");
            }
            
            System.out.println("Found " + testElements.size() + " test elements");
            
            for (Element testElement : testElements) {
                try {
                    MedicalTest test = new MedicalTest();
                    
                    // Extract test name
                    String nameSelector = selectors.getOrDefault("name", ".test-name, .name, h3, h4, .title");
                    Element nameElement = testElement.selectFirst(nameSelector);
                    if (nameElement != null) {
                        test.setName(cleanText(nameElement.text()));
                    }
                    
                    // Extract description
                    String descSelector = selectors.getOrDefault("description", ".description, .details, .info");
                    Element descElement = testElement.selectFirst(descSelector);
                    if (descElement != null) {
                        test.setDescription(cleanText(descElement.text()));
                    }
                    
                    // Extract category
                    String categorySelector = selectors.getOrDefault("category", ".category, .test-category, .type");
                    Element categoryElement = testElement.selectFirst(categorySelector);
                    if (categoryElement != null) {
                        test.setCategory(cleanText(categoryElement.text()));
                    }
                    
                    // Extract preparation instructions
                    String prepSelector = selectors.getOrDefault("preparation", ".preparation, .instructions, .prep");
                    Element prepElement = testElement.selectFirst(prepSelector);
                    if (prepElement != null) {
                        test.setPreparationInstructions(cleanText(prepElement.text()));
                    }
                    
                    // Extract test type
                    String typeSelector = selectors.getOrDefault("testType", ".test-type, .methodology, .method");
                    Element typeElement = testElement.selectFirst(typeSelector);
                    if (typeElement != null) {
                        test.setTestType(cleanText(typeElement.text()));
                    }
                    
                    // Extract duration
                    String durationSelector = selectors.getOrDefault("duration", ".duration, .time, .test-time");
                    Element durationElement = testElement.selectFirst(durationSelector);
                    if (durationElement != null) {
                        test.setDuration(cleanText(durationElement.text()));
                    }
                    
                    // Extract cost
                    String costSelector = selectors.getOrDefault("cost", ".cost, .price, .fee, .amount");
                    Element costElement = testElement.selectFirst(costSelector);
                    if (costElement != null) {
                        test.setCost(cleanText(costElement.text()));
                    }
                    
                    // Extract hospital
                    String hospitalSelector = selectors.getOrDefault("hospital", ".hospital, .clinic, .center");
                    Element hospitalElement = testElement.selectFirst(hospitalSelector);
                    if (hospitalElement != null) {
                        test.setHospital(cleanText(hospitalElement.text()));
                    }
                    
                    // Extract hospital address
                    String addressSelector = selectors.getOrDefault("address", ".address, .location, .hospital-address");
                    Element addressElement = testElement.selectFirst(addressSelector);
                    if (addressElement != null) {
                        test.setHospitalAddress(cleanText(addressElement.text()));
                    }
                    
                    // Extract department
                    String deptSelector = selectors.getOrDefault("department", ".department, .dept, .division");
                    Element deptElement = testElement.selectFirst(deptSelector);
                    if (deptElement != null) {
                        test.setDepartment(cleanText(deptElement.text()));
                    }
                    
                    // Extract availability
                    String availabilitySelector = selectors.getOrDefault("availability", ".availability, .schedule, .available-time");
                    Element availabilityElement = testElement.selectFirst(availabilitySelector);
                    if (availabilityElement != null) {
                        test.setAvailability(cleanText(availabilityElement.text()));
                    }
                    
                    // Extract report delivery time
                    String reportSelector = selectors.getOrDefault("reportTime", ".report-time, .delivery-time, .result-time");
                    Element reportElement = testElement.selectFirst(reportSelector);
                    if (reportElement != null) {
                        test.setReportDeliveryTime(cleanText(reportElement.text()));
                    }
                    
                    // Extract fasting requirement
                    String fastingSelector = selectors.getOrDefault("fasting", ".fasting, .fasting-required, .fast");
                    Element fastingElement = testElement.selectFirst(fastingSelector);
                    if (fastingElement != null) {
                        test.setRequiredFasting(cleanText(fastingElement.text()));
                    }
                    
                    // Extract age restrictions
                    String ageSelector = selectors.getOrDefault("age", ".age-restriction, .age-limit, .age");
                    Element ageElement = testElement.selectFirst(ageSelector);
                    if (ageElement != null) {
                        test.setAgeRestrictions(cleanText(ageElement.text()));
                    }
                    
                    // Extract gender specific
                    String genderSelector = selectors.getOrDefault("gender", ".gender, .gender-specific, .for-gender");
                    Element genderElement = testElement.selectFirst(genderSelector);
                    if (genderElement != null) {
                        test.setGenderSpecific(cleanText(genderElement.text()));
                    }
                    
                    // Extract booking requirement
                    String bookingSelector = selectors.getOrDefault("booking", ".booking-required, .appointment, .booking");
                    Element bookingElement = testElement.selectFirst(bookingSelector);
                    if (bookingElement != null) {
                        test.setBookingRequired(cleanText(bookingElement.text()));
                    }
                    
                    // Extract contact number
                    String contactSelector = selectors.getOrDefault("contact", ".contact, .phone, .mobile");
                    Element contactElement = testElement.selectFirst(contactSelector);
                    if (contactElement != null) {
                        test.setContactNumber(cleanText(contactElement.text()));
                    }
                    
                    // Extract online booking URL
                    String bookingUrlSelector = selectors.getOrDefault("bookingUrl", ".book-online, .booking-link, a[href*='book']");
                    Element bookingUrlElement = testElement.selectFirst(bookingUrlSelector);
                    if (bookingUrlElement != null) {
                        String href = bookingUrlElement.attr("href");
                        if (!href.isEmpty()) {
                            test.setOnlineBookingUrl(href.startsWith("http") ? href : url + href);
                        }
                    }
                    
                    // Extract additional info
                    String additionalSelector = selectors.getOrDefault("additional", ".additional-info, .notes, .remarks");
                    Element additionalElement = testElement.selectFirst(additionalSelector);
                    if (additionalElement != null) {
                        test.setAdditionalInfo(cleanText(additionalElement.text()));
                    }
                    
                    // Only add test if we have at least name and cost
                    if (test.getName() != null && !test.getName().isEmpty() &&
                        test.getCost() != null && !test.getCost().isEmpty()) {
                        tests.add(test);
                        System.out.println("Scraped test: " + test.getName() + " - " + test.getCost());
                    }
                    
                } catch (Exception e) {
                    System.err.println("Error scraping individual test: " + e.getMessage());
                }
            }
            
        } catch (IOException e) {
            System.err.println("Error connecting to URL: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
        }
        
        return tests;
    }
    
    private static String cleanText(String text) {
        if (text == null) return "";
        return text.trim().replaceAll("\\s+", " ");
    }
    
    public static void saveToJson(List<MedicalTest> tests, String fileName) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            FileWriter writer = new FileWriter(fileName);
            gson.toJson(tests, writer);
            writer.close();
            System.out.println("Saved " + tests.size() + " medical tests to " + fileName);
        } catch (IOException e) {
            System.err.println("Error saving to JSON: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        // Example usage
        String url = "https://example-medical-site.com/tests"; // Replace with actual URL
        
        // Define CSS selectors for different elements
        Map<String, String> selectors = new HashMap<>();
        selectors.put("container", ".test-list");
        selectors.put("name", ".test-name");
        selectors.put("description", ".description");
        selectors.put("category", ".category");
        selectors.put("preparation", ".preparation");
        selectors.put("testType", ".test-type");
        selectors.put("duration", ".duration");
        selectors.put("cost", ".cost");
        selectors.put("hospital", ".hospital");
        selectors.put("address", ".address");
        selectors.put("department", ".department");
        selectors.put("availability", ".availability");
        selectors.put("reportTime", ".report-time");
        selectors.put("fasting", ".fasting");
        selectors.put("age", ".age-restriction");
        selectors.put("gender", ".gender");
        selectors.put("booking", ".booking-required");
        selectors.put("contact", ".contact");
        selectors.put("bookingUrl", ".book-online");
        selectors.put("additional", ".additional-info");
        
        // Scrape medical tests
        List<MedicalTest> tests = scrapeMedicalTests(url, selectors);
        
        // Save to JSON
        saveToJson(tests, "medical_tests.json");
    }
}
