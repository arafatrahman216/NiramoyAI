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

public class HospitalScraper {
    
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";
    private static final int TIMEOUT = 10000;
    
    public static class Hospital {
        private String name;
        private String type; // Government, Private, Specialized
        private String address;
        private String area;
        private String city;
        private String phoneNumber;
        private String email;
        private String website;
        private String emergencyContact;
        private String establishedYear;
        private String bedCapacity;
        private String departments;
        private String facilities;
        private String specialties;
        private String rating;
        private String reviewCount;
        private String profileUrl;
        private String latitude;
        private String longitude;
        
        // Constructors
        public Hospital() {}
        
        public Hospital(String name, String type, String address, String area, String city,
                       String phoneNumber, String email, String website, String emergencyContact,
                       String establishedYear, String bedCapacity, String departments,
                       String facilities, String specialties, String rating, String reviewCount,
                       String profileUrl, String latitude, String longitude) {
            this.name = name;
            this.type = type;
            this.address = address;
            this.area = area;
            this.city = city;
            this.phoneNumber = phoneNumber;
            this.email = email;
            this.website = website;
            this.emergencyContact = emergencyContact;
            this.establishedYear = establishedYear;
            this.bedCapacity = bedCapacity;
            this.departments = departments;
            this.facilities = facilities;
            this.specialties = specialties;
            this.rating = rating;
            this.reviewCount = reviewCount;
            this.profileUrl = profileUrl;
            this.latitude = latitude;
            this.longitude = longitude;
        }
        
        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        
        public String getArea() { return area; }
        public void setArea(String area) { this.area = area; }
        
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getWebsite() { return website; }
        public void setWebsite(String website) { this.website = website; }
        
        public String getEmergencyContact() { return emergencyContact; }
        public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
        
        public String getEstablishedYear() { return establishedYear; }
        public void setEstablishedYear(String establishedYear) { this.establishedYear = establishedYear; }
        
        public String getBedCapacity() { return bedCapacity; }
        public void setBedCapacity(String bedCapacity) { this.bedCapacity = bedCapacity; }
        
        public String getDepartments() { return departments; }
        public void setDepartments(String departments) { this.departments = departments; }
        
        public String getFacilities() { return facilities; }
        public void setFacilities(String facilities) { this.facilities = facilities; }
        
        public String getSpecialties() { return specialties; }
        public void setSpecialties(String specialties) { this.specialties = specialties; }
        
        public String getRating() { return rating; }
        public void setRating(String rating) { this.rating = rating; }
        
        public String getReviewCount() { return reviewCount; }
        public void setReviewCount(String reviewCount) { this.reviewCount = reviewCount; }
        
        public String getProfileUrl() { return profileUrl; }
        public void setProfileUrl(String profileUrl) { this.profileUrl = profileUrl; }
        
        public String getLatitude() { return latitude; }
        public void setLatitude(String latitude) { this.latitude = latitude; }
        
        public String getLongitude() { return longitude; }
        public void setLongitude(String longitude) { this.longitude = longitude; }
    }
    
    public static List<Hospital> scrapeHospitals(String url, Map<String, String> selectors) {
        List<Hospital> hospitals = new ArrayList<>();
        
        try {
            System.out.println("Scraping hospitals from: " + url);
            Document doc = Jsoup.connect(url)
                    .userAgent(USER_AGENT)
                    .timeout(TIMEOUT)
                    .get();
            
            // Get the container element that holds all hospital cards
            String containerSelector = selectors.getOrDefault("container", ".hospital-list, .hospitals-container, .search-results");
            Elements hospitalElements = doc.select(containerSelector + " > div, " + containerSelector + " > article, " + containerSelector + " > .hospital-card");
            
            if (hospitalElements.isEmpty()) {
                // Try alternative selectors
                hospitalElements = doc.select(".hospital-item, .hospital-profile, .hospital-listing, .card");
            }
            
            System.out.println("Found " + hospitalElements.size() + " hospital elements");
            
            for (Element hospitalElement : hospitalElements) {
                try {
                    Hospital hospital = new Hospital();
                    
                    // Extract hospital name
                    String nameSelector = selectors.getOrDefault("name", ".hospital-name, .name, h3, h4, .title");
                    Element nameElement = hospitalElement.selectFirst(nameSelector);
                    if (nameElement != null) {
                        hospital.setName(cleanText(nameElement.text()));
                    }
                    
                    // Extract hospital type
                    String typeSelector = selectors.getOrDefault("type", ".hospital-type, .type, .category");
                    Element typeElement = hospitalElement.selectFirst(typeSelector);
                    if (typeElement != null) {
                        hospital.setType(cleanText(typeElement.text()));
                    }
                    
                    // Extract address
                    String addressSelector = selectors.getOrDefault("address", ".address, .location, .full-address");
                    Element addressElement = hospitalElement.selectFirst(addressSelector);
                    if (addressElement != null) {
                        hospital.setAddress(cleanText(addressElement.text()));
                    }
                    
                    // Extract area
                    String areaSelector = selectors.getOrDefault("area", ".area, .locality, .district");
                    Element areaElement = hospitalElement.selectFirst(areaSelector);
                    if (areaElement != null) {
                        hospital.setArea(cleanText(areaElement.text()));
                    }
                    
                    // Extract city
                    String citySelector = selectors.getOrDefault("city", ".city, .town");
                    Element cityElement = hospitalElement.selectFirst(citySelector);
                    if (cityElement != null) {
                        hospital.setCity(cleanText(cityElement.text()));
                    }
                    
                    // Extract phone number
                    String phoneSelector = selectors.getOrDefault("phone", ".phone, .contact, .mobile, .telephone");
                    Element phoneElement = hospitalElement.selectFirst(phoneSelector);
                    if (phoneElement != null) {
                        hospital.setPhoneNumber(cleanText(phoneElement.text()));
                    }
                    
                    // Extract email
                    String emailSelector = selectors.getOrDefault("email", ".email, .contact-email");
                    Element emailElement = hospitalElement.selectFirst(emailSelector);
                    if (emailElement != null) {
                        hospital.setEmail(cleanText(emailElement.text()));
                    }
                    
                    // Extract website
                    String websiteSelector = selectors.getOrDefault("website", ".website, .web, a[href*='www']");
                    Element websiteElement = hospitalElement.selectFirst(websiteSelector);
                    if (websiteElement != null) {
                        String href = websiteElement.attr("href");
                        if (!href.isEmpty()) {
                            hospital.setWebsite(href);
                        } else {
                            hospital.setWebsite(cleanText(websiteElement.text()));
                        }
                    }
                    
                    // Extract emergency contact
                    String emergencySelector = selectors.getOrDefault("emergency", ".emergency, .emergency-contact, .emergency-phone");
                    Element emergencyElement = hospitalElement.selectFirst(emergencySelector);
                    if (emergencyElement != null) {
                        hospital.setEmergencyContact(cleanText(emergencyElement.text()));
                    }
                    
                    // Extract established year
                    String yearSelector = selectors.getOrDefault("established", ".established, .founded, .since");
                    Element yearElement = hospitalElement.selectFirst(yearSelector);
                    if (yearElement != null) {
                        hospital.setEstablishedYear(cleanText(yearElement.text()));
                    }
                    
                    // Extract bed capacity
                    String bedSelector = selectors.getOrDefault("beds", ".beds, .bed-capacity, .capacity");
                    Element bedElement = hospitalElement.selectFirst(bedSelector);
                    if (bedElement != null) {
                        hospital.setBedCapacity(cleanText(bedElement.text()));
                    }
                    
                    // Extract departments
                    String deptSelector = selectors.getOrDefault("departments", ".departments, .depts, .services");
                    Element deptElement = hospitalElement.selectFirst(deptSelector);
                    if (deptElement != null) {
                        hospital.setDepartments(cleanText(deptElement.text()));
                    }
                    
                    // Extract facilities
                    String facilitiesSelector = selectors.getOrDefault("facilities", ".facilities, .amenities, .features");
                    Element facilitiesElement = hospitalElement.selectFirst(facilitiesSelector);
                    if (facilitiesElement != null) {
                        hospital.setFacilities(cleanText(facilitiesElement.text()));
                    }
                    
                    // Extract specialties
                    String specialtiesSelector = selectors.getOrDefault("specialties", ".specialties, .specializations, .expertise");
                    Element specialtiesElement = hospitalElement.selectFirst(specialtiesSelector);
                    if (specialtiesElement != null) {
                        hospital.setSpecialties(cleanText(specialtiesElement.text()));
                    }
                    
                    // Extract rating
                    String ratingSelector = selectors.getOrDefault("rating", ".rating, .stars, .score");
                    Element ratingElement = hospitalElement.selectFirst(ratingSelector);
                    if (ratingElement != null) {
                        hospital.setRating(cleanText(ratingElement.text()));
                    }
                    
                    // Extract review count
                    String reviewSelector = selectors.getOrDefault("reviews", ".reviews, .review-count, .total-reviews");
                    Element reviewElement = hospitalElement.selectFirst(reviewSelector);
                    if (reviewElement != null) {
                        hospital.setReviewCount(cleanText(reviewElement.text()));
                    }
                    
                    // Extract profile URL
                    String profileSelector = selectors.getOrDefault("profileLink", "a, .profile-link, .details-link");
                    Element profileElement = hospitalElement.selectFirst(profileSelector);
                    if (profileElement != null) {
                        String href = profileElement.attr("href");
                        if (!href.isEmpty()) {
                            hospital.setProfileUrl(href.startsWith("http") ? href : url + href);
                        }
                    }
                    
                    // Extract coordinates if available
                    String latSelector = selectors.getOrDefault("latitude", "[data-lat], .latitude");
                    Element latElement = hospitalElement.selectFirst(latSelector);
                    if (latElement != null) {
                        String lat = latElement.attr("data-lat");
                        if (lat.isEmpty()) lat = cleanText(latElement.text());
                        hospital.setLatitude(lat);
                    }
                    
                    String lngSelector = selectors.getOrDefault("longitude", "[data-lng], .longitude");
                    Element lngElement = hospitalElement.selectFirst(lngSelector);
                    if (lngElement != null) {
                        String lng = lngElement.attr("data-lng");
                        if (lng.isEmpty()) lng = cleanText(lngElement.text());
                        hospital.setLongitude(lng);
                    }
                    
                    // Only add hospital if we have at least name and address
                    if (hospital.getName() != null && !hospital.getName().isEmpty() &&
                        hospital.getAddress() != null && !hospital.getAddress().isEmpty()) {
                        hospitals.add(hospital);
                        System.out.println("Scraped hospital: " + hospital.getName() + " - " + hospital.getAddress());
                    }
                    
                } catch (Exception e) {
                    System.err.println("Error scraping individual hospital: " + e.getMessage());
                }
            }
            
        } catch (IOException e) {
            System.err.println("Error connecting to URL: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
        }
        
        return hospitals;
    }
    
    private static String cleanText(String text) {
        if (text == null) return "";
        return text.trim().replaceAll("\\s+", " ");
    }
    
    public static void saveToJson(List<Hospital> hospitals, String fileName) {
        try {
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            FileWriter writer = new FileWriter(fileName);
            gson.toJson(hospitals, writer);
            writer.close();
            System.out.println("Saved " + hospitals.size() + " hospitals to " + fileName);
        } catch (IOException e) {
            System.err.println("Error saving to JSON: " + e.getMessage());
        }
    }
    
    public static void main(String[] args) {
        // Example usage
        String url = "https://example-medical-site.com/hospitals"; // Replace with actual URL
        
        // Define CSS selectors for different elements
        Map<String, String> selectors = new HashMap<>();
        selectors.put("container", ".hospital-list");
        selectors.put("name", ".hospital-name");
        selectors.put("type", ".hospital-type");
        selectors.put("address", ".address");
        selectors.put("area", ".area");
        selectors.put("city", ".city");
        selectors.put("phone", ".phone");
        selectors.put("email", ".email");
        selectors.put("website", ".website");
        selectors.put("emergency", ".emergency");
        selectors.put("established", ".established");
        selectors.put("beds", ".bed-capacity");
        selectors.put("departments", ".departments");
        selectors.put("facilities", ".facilities");
        selectors.put("specialties", ".specialties");
        selectors.put("rating", ".rating");
        selectors.put("reviews", ".review-count");
        selectors.put("profileLink", "a.profile-link");
        selectors.put("latitude", "[data-lat]");
        selectors.put("longitude", "[data-lng]");
        
        // Scrape hospitals
        List<Hospital> hospitals = scrapeHospitals(url, selectors);
        
        // Save to JSON
        saveToJson(hospitals, "hospitals.json");
    }
}
